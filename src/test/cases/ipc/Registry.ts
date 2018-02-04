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

export class ModuleProxyComponent extends ProxyComponent {
  type: 'module';
  private module: IComponentModuleConfig['module'];
  private component: Promise<Component<any>> & { resolve, reject };

  constructor (registry: Registry, config: IComponentModuleConfig) {
    super(registry, config);

    this.module = config.module;

    this.component = <ModuleProxyComponent['component']> new Promise((resolve, reject) => {
      Object.assign(this.component, { resolve, reject });
    });
  }

  async initialize () {
    const module = await import(this.module.path);

    const member = this.module.member || 'default';

    this.component.resolve(module[member]);
  }

  on = async (...args: any[]) => {
    const component = await this.component;

    component.on(...args);
  }
}

export const proxyConstructorMap = new Map([
  ['module', ModuleProxyComponent],
]);
