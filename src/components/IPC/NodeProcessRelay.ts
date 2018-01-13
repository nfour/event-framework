import { Component, IOn } from '../../Component';

export class NodeProcessRelay extends Component<any, NodeProcessRelay> {
  constructor () {
    super();

    this.declare('ipc.relay');

    process.on('message', (message) => {

    });
  }
}
