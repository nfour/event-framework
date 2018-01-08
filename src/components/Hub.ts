import { Component, IOn } from '../Component';

export class Hub extends Component<any, Hub> {
  Emit: {
    (name: 'start');
  };

  On: (
    IOn<{ name: 'start' }>
  );

  Declared: 'start';

  constructor () {
    super();

    this.declare('start');
  }

  /** Emits a start event */
  start () {
    return this.emit('start');
  }
}
