import { HttpRequest, HttpRequestEvent } from '../../components/HttpRequest';
import { HttpRequestActor } from '../../components/HttpRequest/HttpRequestActor';
import { Component, IMergeComponentSignatures } from '../../index';

export class WewMiddleware extends Component<
  IMergeComponentSignatures<BarMiddleware, HttpRequestEvent>,
  WewMiddleware
> {
  Subscribed: 'http.request';
  Declared: 'wew';

  constructor () {
    super();

    this.subscribe('http.request.prepare');
    this.subscribe('baz');
    this.declare('wew');

    // Runs after BarMiddleware
    this.on('http.request.prepare', async (event) => {
      event.wew = 100;

      console.dir({ wew: event.wew });

      await event.emit('wew', event);
    });

    this.on('baz', (event) => {
      console.dir({ baz: event.baz });
    });
  }
}

export class BarMiddleware extends Component<WewMiddleware, BarMiddleware> {
  Declared: 'baz';
  Subscribed: 'wew';

  constructor () {
    super();

    this.subscribe('wew');

    // Runs before WewMiddleware
    this.on('wew', (event) => {
      event.baz = event.wew * 2; // 200

      return event.emit('baz', event);
    });
  }
}

// Connections HttpLambda & HttpServer to HttpRequest
const httpRequest = new HttpRequest();

// Connects middlewares to event components
httpRequest.connectOn('HttpRequestEvent', () =>
  [new WewMiddleware(), new BarMiddleware()],
);

export const actorComponents = [httpRequest, new HttpRequestActor()];
