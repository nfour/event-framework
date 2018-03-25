import { Component } from '../..';
import { IComponentConfig } from '../../types';

/**
 * TODO:
 * this needs to truely act as a proxy, passing through all listeners in the
 * initialize step
 */
export abstract class ProxyComponent extends Component {
  name: IComponentConfig['name'];
  type: IComponentConfig['type'];

  constructor ({ name, type }: IComponentConfig) {
    super();
    Object.assign(this, { name, type });
  }

  abstract async initialize ();
}
