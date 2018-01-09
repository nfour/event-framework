import { Component } from '../../Component';
import { HttpRequestEvent } from './';

/**
 * Responsible for passing http events to Actions
 */
export class HttpRequestActor extends Component<HttpRequestEvent, HttpRequestActor> {
  Subscribed: 'HttpRequestEvent';
  Declared: 'execute';

  constructor () {
    super();

    this.declare('execute');
    this.subscribe('HttpRequestEvent');

    this.connectOn('HttpRequestEvent', () => [new HttpRequestEventRelay(this)]);
  }
}

export class HttpRequestEventRelay extends Component<HttpRequestEvent, HttpRequestActor> {
  Subscribed: 'http.request';

  constructor (httpRequestActor: HttpRequestActor) {
    super();

    this.subscribe('http.request', 'HttpRequestEvent');

    this.on('http.request', (event) => httpRequestActor.emit('execute', event));
  }

}
