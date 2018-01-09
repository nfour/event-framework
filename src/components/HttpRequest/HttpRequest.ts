import { Component } from '../../Component';
import { IMergeComponentSignatures, IOnHttpRequestEvent } from '../../types/events';
import { HttpLambda } from '../HttpLambda';
import { HttpServer } from '../HttpServer';
import { HttpRequestEvent } from './HttpRequestEvent';

export class HttpRequest extends Component<
  IMergeComponentSignatures<HttpServer, HttpLambda, HttpRequestEvent>,
  HttpRequest
> {
  Emit: {
    (
      name: 'HttpRequestEvent',
      event: HttpRequestEvent,
    );
  };

  On: (
    IOnHttpRequestEvent
  );

  Subscribed: 'HttpLambda.request' | 'HttpServer.request';
  Declared: 'HttpRequestEvent';

  constructor () {
    super();

    this.declare('HttpRequestEvent');
    this.subscribe('HttpServer.request', 'HttpLambda.request');

    this.on('HttpLambda.request', this.emitRequest);
    this.on('HttpServer.request', this.emitRequest);
  }

  private emitRequest = async (event: HttpRequestEvent) => {
    console.log('HttpRequest', 'emitRequest');
    await this.emit('HttpRequestEvent', event);

    await event.broadcast();

    return event;
  }
}
