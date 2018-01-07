import { Component } from '../../Component';
import { IComponent, ILambdaHttpHandler, IOn } from '../../index';
import { Action } from '../Action';
import { HttpRequestEvent } from '../HttpRequest/HttpRequestEvent';
import { createHttpEventFromLambda } from './lib';

export class HttpLambda extends Component<IComponent, HttpLambda> {
  Emit: {
    (name: 'HttpLambda.ready', component: HttpLambda);
    (
      name: 'HttpLambda.request',
      event: HttpRequestEvent,
    ): Promise<HttpRequestEvent>|HttpRequestEvent;
  };

  On: (
    IOn<{ name: 'HttpLambda.ready', event: HttpLambda }> &
    IOn<{
      name: 'HttpLambda.request',
      event: HttpRequestEvent,
      return: Promise<HttpRequestEvent>|HttpRequestEvent;
    }>
  );

  Declared: (
    'HttpLambda.request' | 'HttpLambda.request.response'
  );

  Subscribed;

  action: Component<HttpLambda, Action>;

  constructor (action: Component<any, Action>) {
    super();

    this.declare('HttpLambda.request');

    this.action = action;
  }

  handler (): ILambdaHttpHandler {
    return async (inputEvent, context, done) => {
      const event = createHttpEventFromLambda(inputEvent);

      try {
        await this.emit('HttpLambda.request', event);
      } catch (error) {
        event.error = error;
      }

      done(event.error || undefined, event.response);

      return event.response;
    };
  }
}
