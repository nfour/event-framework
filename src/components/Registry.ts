import { Component } from '..';
import { IComponentConfig, IRegistryConfig } from '../types';
import { ModuleProxy } from './Ipc/ModuleProxy';
import { ProxyComponent } from './Ipc/ProxyComponent';

export const proxyConstructorMap = new Map([
  ['module', ModuleProxy],
]);

/**
 * The Registry acts as a component dispenser, specifically
 * a ProxyComponent dispenser. This means components can physically be anywhere
 * yet when retrieved from the Registry will act like the real thing.
 */
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

  add = (config: IComponentConfig): ProxyComponent => {
    const { type } = config;

    const Constructor = proxyConstructorMap.get(type)!;

    const component = new Constructor(config as any);

    this.components.set(component.name, component);

    return component;
  }

  get <C extends Component<any, any> = ProxyComponent> (key: string) {
    return (this.components.get(key) as any) as C;
  }
}
