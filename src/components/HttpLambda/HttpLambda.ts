import { Component } from '../../Component';
import { IComponent, IHttpRequestResponse, ILambdaHttpHandler, IOn, IOnHttpRequestEvent } from '../../index';
import { Action } from '../Action';
import { HttpRequestEvent } from '../HttpRequest/HttpRequestEvent';
import { HttpRequest } from '../HttpRequest/index';
import { createHttpEventFromLambda } from './lib';

/** A HttpRequest emitter fed by AWS Lambda handlers */
export class HttpLambda extends Component<IComponent, HttpLambda> {
  Emit: {
    (
      name: 'HttpRequestEvent.prepare',
      event: HttpRequestEvent,
    ): Promise<HttpRequestEvent>|HttpRequestEvent;
  };

  On: (
    IOn<{
      name: 'HttpRequestEvent.prepare',
      event: HttpRequestEvent,
      return: Promise<HttpRequestEvent>|HttpRequestEvent;
    }>
  );

  Declared: (
   'HttpRequestEvent.prepare'
  );

  action: Action<any, any>;

  constructor (action: Action<any, any>) {
    super();

    this.action = action;

    this.declare('HttpRequestEvent.prepare');

    const httpRequest = Array.from(action.components).find((component) => component instanceof HttpRequest);

    if (!httpRequest) {
      throw new Error(`${this.constructor.name} requires ${action.constructor.name} to be connected to HttpRequest`);
    }

    this.connect(httpRequest);
  }

  handler (): ILambdaHttpHandler {
    return async (inputEvent, context, done) => {
      const event = createHttpEventFromLambda(inputEvent);

      try {
        await this.emit('HttpRequestEvent.prepare', event);
      } catch (error) {
        event.error = error;
      }

      done(event.error || undefined, event.response);

      return event.response;
    };
  }
}
