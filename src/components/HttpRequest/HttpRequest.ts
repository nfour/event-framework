import { IOn } from '../..';
import { Component } from '../../Component';
import { IMergeComponentSignatures } from '../../types/events';
import { HttpLambda } from '../HttpLambda';
import { HttpServer } from '../HttpServer';
import { HttpRequestEvent } from './HttpRequestEvent';

/**
 * Responsible for:
 * - Ingesting HttpRequestEvents.prepare
 * - Triggering its lifecycle
 * - Emitting HttpRequestEvent
 */
export class HttpRequest extends Component<
  IMergeComponentSignatures<HttpServer, HttpLambda, HttpRequestEvent>,
  HttpRequest
> {
  Emit: {
    (
      name: 'HttpRequestEvent',
      event: HttpRequestEvent,
    ): Promise<HttpRequestEvent>|HttpRequestEvent;
  };

  On: (
    IOn<{
      name: 'HttpRequestEvent',
      event: HttpRequestEvent,
      return: Promise<HttpRequestEvent>|HttpRequestEvent;
    }>
  );

  Declared: ('HttpRequestEvent');

  constructor () {
    super();

    this.declare('HttpRequestEvent');
    this.subscribe('HttpRequestEvent.prepare');

    this.on('HttpRequestEvent.prepare', async (event) => {
      await this.emit('HttpRequestEvent', event);

      await event.broadcast();

      return event;
    });
  }

  /** Connect components to the lifecycle event when it is avaliable */
  connectToEvent (getComponents: () => Array<Component<any, any>>) {
    return this.connectOn('HttpRequestEvent.prepare', getComponents);
  }
}
