import { IComponent, ILambdaHttpHandler, IOn } from '../..';
import { Component } from '../../Component';
import { Action } from '../Action';
import { HttpRequest } from '../HttpRequest';
import { HttpRequestEvent } from '../HttpRequest/HttpRequestEvent';
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

  // TODO: create a function like this, but which wires this handler up to an Action via 'execute'
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
