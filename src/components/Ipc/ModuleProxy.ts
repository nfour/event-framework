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
  private watching: FSWatcher[] = [];

  constructor (config: IComponentModuleConfig) {
    super(config);

    this.config = config;

    this.component = deferredPromise();
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

      await new Promise((resolve) => component().once('ready', resolve));

      await component().loadState();
    } else {
      // Local component

      const component = this.type === 'function-action-module'
        ? functionActionModuleGetter(path, member)
        : () => require(path)[member];

      const watchers = await watchModule(path);

      this.watching.push(...watchers);

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
    this.watching.forEach((watcher) => {
      watcher.close();
      watcher.removeAllListeners();
    });

    this.watching = [];
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
 * TODO: Dependencies must produce a tree in order to walk it backwards and reload all modules
 * TODO: this should be cached in a single place to prevent watching the same file more than once
 * TODO: try using the graph library from localdev
 */
async function watchModule (entryPath: string, dependentPaths: string[] = []): Promise<FSWatcher[]> {
  const rootModule = require.resolve(entryPath);
  const dependencyPaths = getImportDependencies(await readFile(rootModule, 'utf8'));
  const rootDir = dirname(rootModule);

  const dependencies = await map(dependencyPaths, (relPath) => {
    const dependencyPath = resolve(rootDir, relPath);

    return watchModule(
      dependencyPath,
      [...new Set([rootModule, ...dependentPaths])], // Using a Set to ensure uniques
    );
  });

  return Promise.all([
    watchFile(rootModule),
    ...flatten(dependencies),
  ]);
}

function watchFile (entryPath: string, parent?: string) {
  const watcher = watch(entryPath);

  return new Promise<FSWatcher>((done) => {
    watcher.on('ready', () => {
      // tslint:disable-next-line:no-console
      console.log(`[Watching]:`, entryPath);

      watcher.on('all', (...args) => {
        const path = args[1];

        if (path === entryPath) {
          // tslint:disable-next-line:no-console
          console.log(`[Watching] [Hot reloading]: ${path}`);

          if (!require.cache) {
            console.error('[Watching] Missing require cache!');
            return;
          }
          delete require.cache[path];
          if (parent) { delete require.cache[parent]; }
        }
      });

      done(watcher);
    });
  });
}

function reloadModule (path: string) {
  // tslint:disable-next-line:no-console
  console.log(`[Watching] [Reloading]: ${path}`);

  if (!require.cache) {
    console.error('[Watching] Missing require cache!');
    return;
  }

  delete require.cache[path];

  if (parent) { delete require.cache[parent]; }
}
