import { Component } from '../../../..';
import { IComponentConfig } from '../types/registry';
import { ModuleProxy } from './ModuleProxy';
import { Registry } from './Registry';

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
