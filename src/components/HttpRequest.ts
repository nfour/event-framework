import { Component } from '../Component';
import { IHttpRequestResponse } from '../types';
import { IMergeComponentSignatures, IOnHttpRequestEvent } from '../types/events';
import { HttpLambda } from './HttpLambda';
import { HttpRequestEvent } from './HttpRequestEvent';
import { HttpServer } from './HttpServer';

export class HttpRequest extends Component<
  IMergeComponentSignatures<HttpServer, HttpLambda, HttpRequestEvent>,
  HttpRequest
> {
  Emit: {
    (
      name: 'http.request',
      event: HttpRequestEvent,
    ): Promise<IHttpRequestResponse>|IHttpRequestResponse;
    (
      name: 'http.request.response',
      event: HttpRequestEvent,
    ): Promise<HttpRequestEvent>|HttpRequestEvent;
  };

  On: (
    IOnHttpRequestEvent
  );

  Subscribed: 'HttpLambda.request' | 'HttpServer.request' | 'HttpRequestEvent';
  Declared: 'http.request' | 'http.request.response';

  constructor () {
    super();

    this.declare('http.request');
    this.declare('http.request.response');

    this.subscribe('HttpServer.request');
    this.subscribe('HttpLambda.request');
    // TODO: make this automated
    // this.subscribe('HttpRequestEvent');

    this.on('HttpLambda.request', this.emitRequest);
    this.on('HttpServer.request', this.emitRequest);
  }

  private emitRequest = async (event: HttpRequestEvent) => {
    this.connect(event);

    await event.announce();

    const response = await this.emit('http.request', event);

    event.response = response;

    await this.emit('http.request.response', event);

    return event;
  }
}
