import { Component } from '../Component';
import { IComponent, IOn } from '../index';

// TODO: ability to pass through component inheritence
export class Action extends Component<IComponent, Action> {
  public Emit: {
    (name: 'execute', ...args: any[]);
    (name: 'execute.complete', result: any);
  };

  public On: (
    IOn<{ name: 'execute', event: any, return: any }> &
    IOn<{ name: 'execute.complete', event: any, return: any }>
  );

  public Declared: 'execute' | 'execute.complete';
  public Subscribed: 'execute';
  public callback: (...args: any[]) => any;

  constructor (callback: Action['callback']) {
    super();

    this.callback = callback;

    this.declare('execute');
    this.declare('execute.complete');

    this.on('execute', this.execute);
  }

  public execute = async (...args) => {
    const result = await this.callback(...args);

    await this.emit('execute.complete', result);

    return result;
  }
}
