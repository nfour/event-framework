import { Component } from '../../Component';
import { IMergeComponentSignatures, IOnHttpRequestEvent } from '../../types/events';
import { HttpLambda } from '../HttpLambda';
import { HttpServer } from '../HttpServer';
import { HttpRequestEvent } from './HttpRequestEvent';

/** Responsible for ingesting HttpRequestEvents and emitting them to subscribers */
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

  Declared: 'HttpRequestEvent';

  constructor () {
    super();

    this.declare('HttpRequestEvent');
    this.subscribe('HttpServer.request', 'HttpLambda.request');

    this.on('HttpLambda.request', this.emitRequest);
    this.on('HttpServer.request', this.emitRequest);
  }

  connectToEvent (getComponents: () => Array<Component<any, any>>) {
    return this.connectOn('HttpRequestEvent' as any, getComponents);
  }

  private emitRequest = async (event: HttpRequestEvent) => {
    await this.emit('HttpRequestEvent', event);

    await event.broadcast();

    return event;
  }

}
