import { HttpRequestActor, HttpRequestEvent } from '../../../components/HttpRequest/index';
import { Component } from '../../../index';

/** Connects HttpRequestActor to HttpRequestEvent */
export class IpcHttpRequestEventRelay extends Component<HttpRequestEvent, HttpRequestActor> {
  constructor () {
    super();

    this.subscribe('ipc.relay');

    this.on('ipc.relay', (event) => httpRequestActor.emit('execute', event));
  }
}
