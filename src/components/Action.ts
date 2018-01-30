import { Component } from '../Component';
import { IOn } from '../index';

export class Action<E, R> extends Component<any, Action<E, R>> {
  Emit: {
    (name: 'execute', ...args: any[]);
    (name: 'execute.complete', result: any);
  };

  On: (
    IOn<{ name: 'execute', event: any, return: any }> &
    IOn<{ name: 'execute.complete', event: any, return: any }>
  );

  Declared: 'execute.complete';

  callback: (event: E) => R;

  constructor (callback: Action<E, R>['callback']) {
    super();

    this.callback = callback;

    this.subscribe('execute');
    this.declare('execute.complete');

    this.on('execute', this.execute);
  }

  private execute = async (event: E) => {
    const result = await Promise.resolve(this.callback(event));

    await this.emit('execute.complete', result);

    return result;
  }
}
