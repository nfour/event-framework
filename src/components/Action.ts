import { Component, IComponentSignaturesGeneric } from '../Component';
import { IOn } from '../index';

// TODO: ability to pass through component inheritence
export class Action<E extends IComponentSignaturesGeneric = any> extends Component<E, Action> {
  Emit: {
    (name: 'execute', ...args: any[]);
    (name: 'execute.complete', result: any);
  };

  On: (
    IOn<{ name: 'execute', event: any, return: any }> &
    IOn<{ name: 'execute.complete', event: any, return: any }>
  );

  Declared: 'execute.complete';
  Subscribed: 'execute';
  callback: (...args: any[]) => any;

  constructor (callback: Action['callback']) {
    super();

    this.callback = callback;

    this.subscribe('execute');
    this.declare('execute.complete');

    this.on('execute', this.execute);
  }

  execute = async (...args) => {
    const result = await this.callback(...args);

    await this.emit('execute.complete', result);

    return result;
  }
}
