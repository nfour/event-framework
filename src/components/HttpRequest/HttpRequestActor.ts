import { Component } from '../../Component';
import { HttpRequestEvent } from './';

/**
 * Responsible for passing http events to Actions
 */
export class HttpRequestActor extends Component<HttpRequestEvent, HttpRequestActor> {
  Subscribed: 'http.request';
  Declared: 'execute';

  constructor () {
    super();

    this.declare('execute');
    this.subscribe('http.request');

    this.on('http.request', (...args) => this.emit('execute', ...args));
  }
}
