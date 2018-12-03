import { map } from 'bluebird';
import { fork } from 'child_process';
import { FSWatcher, watch } from 'chokidar';
import { readFile } from 'fs-extra';
import { dirname, resolve } from 'path';
import * as getImportDependencies from 'precinct';
import { sync as resolveRequire } from 'resolve';

import { Component } from '../..';
import { deferredPromise, IDefferedPromise } from '../../test/lib';
import { IComponentModuleConfig } from '../../types';
import { Action } from '../Action';
import { ProcessComponent } from './ProcessComponent';
import { ProxyComponent } from './ProxyComponent';

export interface IActionableFunction<In = any, Out = any> { (input: In): Out; }

export interface IModuleProxyImport { [member: string]: Component<any>|IActionableFunction; }

/**
 * Provides an abstraction to a component via a module import based on a config.
 *
 * If the config describes `fork`, which causes the module to be forked as a child process instead.
 */
export class ModuleProxy extends ProxyComponent {
  type: 'module' | 'function-action-module';

  private config: IComponentModuleConfig;
  private component: IDefferedPromise<() => Component<any>>;
  private watcher?: FSWatcher;

  constructor (config: IComponentModuleConfig) {
    super(config);

    this.config = config;
    this.component = deferredPromise();

    if (config.module.watch) {
      this.watcher = watch([]);

      // TODO: use a centralized logger!
      reloadOnChanges({
        watcher: this.watcher,
        // tslint:disable-next-line no-console no-empty
        log: process.env.DEBUG_WATCHING ? console.log : () => {},
      });
    }
  }

  async initialize () {
    const { path, member = 'default' } = this.config.module;

    if (this.config.fork) {
      // Process spawn component

      const child = fork('spawnProcess.ts', [path, member, this.name, this.type], {
        cwd: __dirname,
        execArgv: ['-r', 'ts-node/register'],
      });

      const processComponent = new ProcessComponent(child);
      this.component.resolve(() => processComponent);

      const component = <() => ProcessComponent> await this.component;

      await new Promise((done) => component().once('ready', done));

      await component().loadState();
    } else {
      // Local component

      const component = this.type === 'function-action-module'
        ? functionActionModuleGetter(path, member)
        : () => require(path)[member];

      if (this.config.module.watch) {
        await watchModule({ watcher: this.watcher!, entryPath: path, originPath: path });
      }

      this.component.resolve(component);
    }

    return this;
  }

  on = async (...args: any[]) => {
    const component = await this.component;

    return component().on(...args);
  }

  emit = async (...args: any[]) => {
    const component = await this.component;

    return component().emit(...args);
  }

  teardown () {
    if (this.watcher) {
      this.watcher.close();
      this.watcher.removeAllListeners();
    }
  }
}

/**
 * Works around require.cache by creating a closure around imported modules
 * in order to maintain the same Action class reference through consecutive calls
 */
function functionActionModuleGetter (modulePath: string, member: string) {
  let action: Action<any, any>;
  // tslint:disable-next-line:ban-types
  let cachedImportFn: Function;

  return () => {
    const importFn = require(modulePath)[member];

    if (importFn === cachedImportFn) { return action; }

    cachedImportFn = importFn;
    action = new Action(importFn);

    return action;
  };
}

/**
 * Watches a given module path then looks for its module dependencies and watches those too.
 */
async function watchModule ({ entryPath, watcher, originPath = entryPath }: {
  entryPath: string,
  originPath?: string,
  watcher: FSWatcher,
}): Promise<FSWatcher> {
  /**
   * We dont need to use resolveRequire. require.resolve will suffice for non-node-module scopes (as is ours atm)
   * But... It will let us deal with node_modules in future so im going to leave it for now...
   */
  const modulePath = resolveRequire(
    require.resolve(entryPath), // <-- ensures there is a file extension
    { basedir: originPath }, // <-- Ensures the module is resolved from where it would normally be required
  );

  const moduleDir = dirname(modulePath);

  watcher.add(modulePath);

  const dependencyPaths = getImportDependencies(await readFile(modulePath, 'utf8'));

  await map(dependencyPaths, (importPath): any => {
    const isRelative = /^\./.test(importPath);

    if (!isRelative) { return; }

    return watchModule({ watcher, entryPath: resolve(moduleDir, importPath) });
  });

  return watcher;
}

function reloadOnChanges ({ watcher, log }: { watcher: FSWatcher, log: typeof console.log }) {
  return watcher
    .on('change', (path) => {
      if (!require.cache) {
        log('[Watch] Error: Missing require cache!');
        return;
      }

      log(`[Watch] Reloading: ${path}`);

      Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    })
    .on('add', (path) => log(`[Watch] Added: ${path}`));
}
