import { map } from 'bluebird';
import { fork } from 'child_process';
import { FSWatcher, watch } from 'chokidar';
import { readFile } from 'fs-extra';
import { flatten } from 'lodash';
import { dirname, resolve } from 'path';
import * as getImportDependencies from 'precinct';

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
      // tslint:disable-next-line no-console no-empty
      reloadOnChanges({
        watcher: this.watcher,
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
        await watchModule(path, this.watcher!);
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
async function watchModule (entryPath: string, watcher: FSWatcher): Promise<FSWatcher> {
  const modulePath = require.resolve(entryPath);
  const moduleDir = dirname(modulePath);

  const dependencyPaths = getImportDependencies(await readFile(modulePath, 'utf8'));

  watcher.add(modulePath);

  await map(dependencyPaths, (relPath) => {
    const dependencyPath = resolve(moduleDir, relPath);

    return watchModule(dependencyPath, watcher);
  });

  return watcher;
}

function reloadOnChanges ({ watcher, log }: { watcher: FSWatcher, log: typeof console.log }) {
  return watcher
    .on('all', (...args) => {
      const path = args[1];

      if (!require.cache) {
        log('[Watch] Error: Missing require cache!');
        return;
      }

      if (path in require.cache) {
        log(`[Watch] Reloading: ${path}`);

        Object.keys(require.cache).forEach((key) => delete require.cache[key]);
      }
    })
    .on('add', (path) => log(`[Watch] Added: ${path}`));
}
