import { fork } from 'child_process';

import { Component } from '../..';
import { deferredPromise, IDefferedPromise } from '../../test/lib';
import { IComponentModuleConfig } from '../../types';
import { ProcessComponent } from './ProcessComponent';
import { ProxyComponent } from './ProxyComponent';

/**
 * Provides an abstraction to a component via a module import based on a config.
 *
 * If the config describes `fork`, which causes the module to be forked as a child process instead.
 */
export class ModuleProxy extends ProxyComponent {
  type: 'module';
  private config: IComponentModuleConfig;
  private component: IDefferedPromise<Component<any>>;

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

      this.component.resolve(new ProcessComponent(child));

      const component = <ProcessComponent> await this.component;

      await new Promise((resolve) => component.once('ready', resolve));

      await component.loadState();
    } else {
      // Local component

      const module: Component<any> = await import(path);

      this.component.resolve(module[member]);
    }
  }

  on = async (...args: any[]) => {
    const component = await this.component;

    return component.on(...args);
  }

  emit = async (...args: any[]) => {
    const component = await this.component;

    return component.emit(...args);
  }
}
