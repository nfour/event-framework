import { fork } from 'child_process';
import { watch } from 'chokidar';
import * as decache from 'decache';
import * as depTree from 'dependency-tree';
import * as escapeRegex from 'escape-string-regexp';

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
      this.component.resolve(processComponent);

      const component = <() => ProcessComponent> await this.component;

      await new Promise((resolve) => component().once('ready', resolve));

      await component().loadState();
    } else {
      // Local component

      watchModule(path);

      if (this.type === 'function-action-module') {
        const component = functionActionModuleGetter(path, member);

        this.component.resolve(component);
      } else {
        const component = () => require(path)[member];

        this.component.resolve(component);
      }

    }
  }

  on = async (...args: any[]) => {
    const component = await this.component;

    return component().on(...args);
  }

  emit = async (...args: any[]) => {
    const component = await this.component;

    return component().emit(...args);
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

// TODO: this needs to create a dep tree of the watch module and watch that too
function watchModule (filePath: string) {
  const watcher = watch(filePath + '.ts');

  console.log(`Watching ${filePath} for changes...`);

  watcher.on('ready', () => {
    watcher.on('all', (...args) => {
      Object.keys(require.cache)
      .filter((path) => !/node_modules/.test(path))
      .forEach((path) => {
        const re = new RegExp(escapeRegex(filePath));
        if (re.test(path)) {
          console.log(`Hot reloading: ${path}`);

          decache(path);
        }
      });
    });
  });

  return watcher;
}
