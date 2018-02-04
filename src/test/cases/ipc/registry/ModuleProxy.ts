import { Component } from '../../../..';
import { deferredPromise, IDefferedPromise } from '../../../lib';
import { IComponentModuleConfig } from '../types/registry';
import { ProxyComponent, Registry } from './Registry';

export class ModuleProxy extends ProxyComponent {
  type: 'module';
  private module: IComponentModuleConfig['module'];
  private component: IDefferedPromise<Component<any>>;

  constructor (registry: Registry, config: IComponentModuleConfig) {
    super(registry, config);

    this.module = config.module;

    this.component = deferredPromise();
  }

  async initialize () {
    const module: Component<any> = await import(this.module.path);

    const member = this.module.member || 'default';

    this.component.resolve(module[member]);
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

export class ProcessComponent extends Component {
  constructor (config: IComponentModuleConfig['module']) {
    super();

  }

}
