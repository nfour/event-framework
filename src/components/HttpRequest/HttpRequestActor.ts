import { Component } from '../../Component';
import { HttpRequestEvent } from './';

/** Connects HttpRequestActor to HttpRequestEvent */
export class HttpRequestEventRelay extends Component<HttpRequestEvent, HttpRequestActor> {
  constructor (httpRequestActor: HttpRequestActor) {
    super();

    this.subscribe('http.request');

    this.on('http.request', (event) => httpRequestActor.emit('execute', event));
  }
}

/**
 * Connects HttpRequest to Action's
 */
export class HttpRequestActor extends Component<HttpRequestEvent, HttpRequestActor> {
  Declared: 'execute';

  constructor () {
    super();

    this.declare('execute');
    this.subscribe('HttpRequestEvent');

    this.connectOn('HttpRequestEvent', () => [new HttpRequestEventRelay(this)]);
  }
}
