import { Component, IOn } from '../Component';

export class Hub extends Component<any, Hub> {
  public Emit: {
    (name: 'start');
  };

  public On: (
    IOn<{ name: 'start' }>
  );

  public Declared: 'start';
  public Subscribed;

  constructor () {
    super();

    this.declare('start');
  }

  /** Emits a start event */
  public start () {
    return this.emit('start');
  }
}
