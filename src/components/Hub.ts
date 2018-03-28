import { Component, IOn } from '../Component';

/**
 * Merely responsibly for emitting a `ready` event.
 *
 * This component should be used to "start" a set of components which
 * rely on such a workflow
 */
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
