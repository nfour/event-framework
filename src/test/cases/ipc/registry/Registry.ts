import { Component } from '../../../..';
import { deferredPromise, IDefferedPromise } from '../../../lib';
import { IComponentConfig, IComponentModuleConfig, IRegistryConfig } from '../types/registry';
import { ModuleProxy } from './ModuleProxy';

export class Registry {
  private components: Map<string, ProxyComponent> = new Map();

  constructor (
    public config: IRegistryConfig,
  ) {
    this.config = config;

    config.forEach(this.add);
  }

  async initialize () {
    const components = Array.from(this.components.values());

    await Promise.all(
      components.map((component) => component.initialize()),
    );
  }

  add = (config: IComponentConfig) => {
    const { type } = config;

    const Constructor = proxyConstructorMap.get(type)!;

    const component = new Constructor(this, config as any);

    this.components.set(component.name, component);
  }

  get <C extends Component<any, any> = ProxyComponent> (key: string) {
    return (this.components.get(key) as any) as C;
  }
}

// TODO: communication layer between proxy component and actual component
// all components must undergo a conformance phase to remove method/prop access
// must use only events for this lifecycle of component
// - could technically proxy all constructure.prototype methods if the reg becomes
// aware of various component types eg. Action, allowing it to queue up .execute() till after initialize

/**
 * TODO:
 * this needs to truely act as a proxy, passing through all listeners in the
 * initialize step
 */
export abstract class ProxyComponent extends Component {
  name: IComponentConfig['name'];
  type: IComponentConfig['type'];
  protected registry: Registry;

  constructor (registry: Registry, { name, type }: IComponentConfig) {
    super();
    Object.assign(this, { registry, name, type });
  }

  abstract async initialize ();
}

export const proxyConstructorMap = new Map([
  ['module', ModuleProxy],
]);
