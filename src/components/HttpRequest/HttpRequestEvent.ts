import { v4 as uuid } from 'uuid';
import { Component } from '../../Component';
import { IHttpRequestEvent, IHttpRequestResponse, IOnHttpRequestEvent } from '../../index';
import { IEventComponent } from '../../types/events';
import { Hub } from '../Hub';

export interface IHttpRequestEventInput {
  id?: IHttpRequestEvent['id'];
  response?: IHttpRequestEvent['response'];
  error?: IHttpRequestEvent['error'];
  request: IHttpRequestEvent['request'];
}

export class HttpRequestEvent extends Component<Hub, HttpRequestEvent> implements IHttpRequestEvent, IEventComponent {
  id: IHttpRequestEvent['id'];
  request: IHttpRequestEvent['request'];
  response: IHttpRequestEvent['response'];
  error: IHttpRequestEvent['error'];

  Emit: {
    (
      name: 'HttpRequestEvent' | 'http.request.prepare' | 'http.request.response',
      event: HttpRequestEvent,
    );
    (
      name: 'http.request',
      event: HttpRequestEvent,
    ): Promise<IHttpRequestResponse>|IHttpRequestResponse;
  };

  On: (
    IOnHttpRequestEvent
  );

  Declared: 'HttpRequestEvent' | 'http.request.prepare' | 'http.request' | 'http.request.response';

  constructor (fields: IHttpRequestEventInput) {
    super();

    Object.assign(this, fields);

    if (!this.id) { this.id = uuid(); }

    this.declare('HttpRequestEvent', 'http.request.prepare', 'http.request', 'http.request.response');
  }

  async broadcast () {
    await this.emit('HttpRequestEvent', this);
    await this.emit('http.request.prepare', this);

    this.response = await this.emit('http.request', this);

    await this.emit('http.request.response', this);
  }

}
