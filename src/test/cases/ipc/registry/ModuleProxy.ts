import { fork } from 'child_process';
import { Component } from '../../../..';
import { deferredPromise, IDefferedPromise } from '../../../lib';
import { IComponentModuleConfig } from '../types/registry';
import { ProxyComponent } from './ProxyComponent';
import { Registry } from './Registry';

export class ModuleProxy extends ProxyComponent {
  type: 'module';
  private config: IComponentModuleConfig;
  private component: IDefferedPromise<Component<any>>;

  constructor (registry: Registry, config: IComponentModuleConfig) {
    super(registry, config);

    this.config = config;

    this.component = deferredPromise();
  }

  async initialize () {
    const { path, member = 'default' } = this.config.module;

    if (this.config.spawn) {
      // Process spawn component

      // TODO: need to make a spawner file which takes path/member as args
      const child = fork('./spawn.ts', [path, member], { cwd: __dirname });
    } else {
      // Local component

      const module: Component<any> = await import(path);

      this.component.resolve(module[member]);
    }
  }

  on = async (...args: any[]) => {
    const component = await this.component;

    component.on(...args);
  }

  emit = async (...args: any[]) => {
    const component = await this.component;

    return component.emit(...args);
  }
}

export class ProcessModuleComponent extends Component {
  constructor (child) {
    super();

    this.process = child;

  }

}
