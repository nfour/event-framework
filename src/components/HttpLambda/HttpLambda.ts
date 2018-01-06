import { Component } from '../../Component';
import { IComponent, IHttpRequestResponse, ILambdaHttpHandler, IOn } from '../../index';
import { Action } from '../Action';
import { HttpRequestEvent } from '../HttpRequestEvent';
import { createHttpEventFromLambda } from './lib';

export class HttpLambda extends Component<IComponent, HttpLambda> {
  Emit: {
    (name: 'HttpLambda.ready', component: HttpLambda);
    (
      name: ('HttpLambda.request' | 'HttpLambda.request.response'),
      event: HttpRequestEvent,
    ): Promise<IHttpRequestResponse>|IHttpRequestResponse;
  };

  On: (
    IOn<{ name: 'HttpLambda.ready', event: HttpLambda }> &
    IOn<{
      name: 'HttpLambda.request' | 'HttpLambda.request.response',
      event: HttpRequestEvent,
      return: Promise<IHttpRequestResponse>|IHttpRequestResponse;
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
        const response = await this.emit('HttpLambda.request', event);

        event.response = response;
      } catch (error) {
        event.error = error;
      }
      try {
        await this.emit('HttpLambda.request.response', event);
      } catch (error) {
        event.error = error;
      }

      done(event.error || undefined, event.response);

      return event.response;
    };
  }
}
