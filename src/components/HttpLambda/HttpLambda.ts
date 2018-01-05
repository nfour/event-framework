import { Component } from '../../Component';
import { IComponent, IHttpRequestEvent, IHttpRequestResponse, ILambdaHttpHandler, IOn } from '../../index';
import { Action } from '../Action';
import { createHttpEventFromLambda } from './lib';

export class HttpLambda extends Component<IComponent, HttpLambda> {
  public Emit: {
    (name: 'HttpLambda.ready', component: HttpLambda);
    (
      name: (
        'http.request' | 'HttpLambda.request' |
        'http.request.response' | 'HttpLambda.request.response'
      ),
      event: IHttpRequestEvent,
    );
  };

  public On: (
    IOn<{ name: 'HttpLambda.ready', event: HttpLambda }> &
    IOn<{
      name: 'HttpLambda.request' | 'HttpLambda.request.response',
      event: IHttpRequestEvent,
      return: void,
    }> &
    IOn<{
      name: 'http.request' | 'http.request.response',
      event: IHttpRequestEvent,
      return: Promise<IHttpRequestResponse>|IHttpRequestResponse,
    }>
  );

  public Declared: (
    'http.request' | 'http.request.response' |
    'HttpLambda.request' | 'HttpLambda.request.response'
  );

  public Subscribed;

  public action: Component<HttpLambda, Action>;

  constructor (action: Component<any, Action>) {
    super();

    this.declare('http.request');
    this.declare('http.request.response');
    this.declare('HttpLambda.request');

    this.action = action;
  }

  public handler (): ILambdaHttpHandler {
    return async (inputEvent, context, done) => {
      const event = createHttpEventFromLambda(inputEvent);

      try {
        await this.emit('HttpLambda.request', event);

        const response = await this.action.emit('http.request', event);

        event.response = response;
      } catch (error) {
        event.error = error;
      }
      try {
        await this.emit('http.request.response', event);
        await this.emit('HttpLambda.request.response', event);
      } catch (error) {
        event.error = error;
      }

      done(event.error || undefined, event.response);

      return event.response;
    };
  }
}

