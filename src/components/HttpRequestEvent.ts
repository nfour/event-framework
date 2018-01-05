import { v4 as uuid } from 'uuid';
import { Component } from '../Component';
import { IHttpRequestEvent } from '../index';

export interface IHttpRequestEventParams {
  id?: IHttpRequestEvent['id'];
  response?: IHttpRequestEvent['response'];
  error?: IHttpRequestEvent['error'];
  request: IHttpRequestEvent['request'];
}

export class HttpRequestEvent extends Component implements IHttpRequestEvent {
  id: IHttpRequestEvent['id'];
  request: IHttpRequestEvent['request'];
  response: IHttpRequestEvent['response'];
  error: IHttpRequestEvent['error'];

  constructor (fields: IHttpRequestEventParams) {
    super();

    Object.assign(this, fields);

    if (!this.id) { this.id = uuid(); }
  }
}
