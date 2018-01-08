import { Component } from '../../Component';
import { HttpRequest } from './';

/**
 * Responsible for passing http events to Actions
 */
export class HttpRequestActor extends Component<HttpRequest, HttpRequestActor> {
  Subscribed: 'http.request';
  Declared: 'execute';

  constructor () {
    super();

    this.declare('execute');
    this.subscribe('http.request');

    this.on('http.request', (...args) => this.emit('execute', ...args));
  }
}
