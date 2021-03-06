import { Component } from '../Component';
import { IOn } from '../index';

export interface IComponentExecutor<E> {
  Emit: {
    (name: 'execute', event: E);
  };

  On;
  Declared: 'execute';
}

export class Action<E, R> extends Component<IComponentExecutor<E>, Action<E, R>> {
  Emit: {
    (name: 'execute', ...args: any[]);
    (name: 'execute.complete', result: any);
  };

  On: (
    IOn<{ name: 'execute', event: any, return: any }> &
    IOn<{ name: 'execute.complete', event: any, return: any }>
  );

  Declared: 'execute.complete';

  /**
   * FIXME: Only when TypeScript supports variadic arguments, we can fix this assignment
   * - https://github.com/Microsoft/TypeScript/issues/5453
   */
  constructor (callback: (...args: E[]) => R) {
    super();

    this.subscribe('execute');
    this.declare('execute.complete');

    this.on('execute', async (...args) => {
      const result = await Promise.resolve(callback(...args));

      await this.emit('execute.complete', result);

      return result;
    });
  }
}
