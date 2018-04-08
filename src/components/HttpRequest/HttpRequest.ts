import { Component } from '../../Component';
import { IMergeComponentSignatures, IOnHttpRequestEvent } from '../../types/events';
import { HttpLambda } from '../HttpLambda';
import { HttpServer } from '../HttpServer';
import { HttpRequestEvent } from './HttpRequestEvent';

/**
 * Responsible for:
 * - Ingesting HttpRequestEvents
 * - Triggering its lifecycle
 * - Emitting HttpRequestEvent to subscribers
 */
export class HttpRequest extends Component<
  IMergeComponentSignatures<HttpServer, HttpLambda, HttpRequestEvent>,
  HttpRequest
> {
  constructor () {
    super();

    this.subscribe('HttpRequestEvent');

    this.on('HttpRequestEvent', async (event) => {
      await event.broadcast();

      return event;
    });
  }

  /** Connect components to the lifecycle event when it is avaliable */
  connectToEvent (getComponents: () => Array<Component<any, any>>) {
    return this.connectOn('HttpRequestEvent', getComponents);
  }
}
