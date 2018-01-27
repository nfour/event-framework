import { Component } from '../../..';
import { IComponentConfig, IComponentModuleConfig, IRegistryConfig } from './types/registry';

export class Registry {
  components: Map<string, ProxyComponent> = new Map();

  constructor (
    public config: IRegistryConfig,
  ) {
    this.config = config;

    config.forEach(this.add);
  }

  add = (config: IComponentConfig) => {
    const { type } = config;

    const Constructor = proxyConstructorMap.get(type)!;

    const component = new Constructor(this, config as any);

    this.components.set(component.name, component);
  }

  get (key: string) {
    return this.components.get(key);
  }
}

// TODO: communication layer between proxy component and actual component
// all components must undergo a conformance phase to remove method/prop access
// must use only events for this lifecycle of component

export abstract class ProxyComponent {
  name: IComponentConfig['name'];
  type: IComponentConfig['type'];

  protected registry: Registry;

  constructor (registry: Registry, { name, type }: IComponentConfig) {
    Object.assign(this, { registry, name, type });
  }

  abstract async initialize ();

}

export class ModuleProxyComponent extends ProxyComponent {
  type: 'module';
  module: IComponentModuleConfig['module'];
  component: Component<any>;

  constructor (registry: Registry, config: IComponentModuleConfig) {
    super(registry, config);

    this.module = config.module;
  }

  async initialize () {
    const module = await import(this.module.path);

    const member = this.module.member || 'default';

    this.component = module[member];
  }

}

export const proxyConstructorMap = new Map([
  ['module', ModuleProxyComponent],
]);
