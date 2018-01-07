import { v4 as uuid } from 'uuid';
import { Component } from '../Component';
import { IHttpRequestEvent } from '../index';
import { Hub } from './Hub';

export interface IHttpRequestEventInput {
  id?: IHttpRequestEvent['id'];
  response?: IHttpRequestEvent['response'];
  error?: IHttpRequestEvent['error'];
  request: IHttpRequestEvent['request'];
}

export class HttpRequestEvent extends Component<Hub, HttpRequestEvent> implements IHttpRequestEvent {
  id: IHttpRequestEvent['id'];
  request: IHttpRequestEvent['request'];
  response: IHttpRequestEvent['response'];
  error: IHttpRequestEvent['error'];

  Emit: {
    (
      name: 'HttpRequestEvent',
      event: HttpRequestEvent,
    );
  };

  Declared: 'HttpRequestEvent';

  constructor (fields: IHttpRequestEventInput) {
    super();

    Object.assign(this, fields);

    if (!this.id) { this.id = uuid(); }

    this.declare('HttpRequestEvent');
  }

  announce () {
    return this.emit('HttpRequestEvent', this);
  }

}
