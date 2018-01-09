import { HttpRequest, HttpRequestEvent } from '../../components/HttpRequest';
import { HttpRequestActor } from '../../components/HttpRequest/HttpRequestActor';
import { Component, IMergeComponentSignatures } from '../../index';

export class Wew extends Component<
  IMergeComponentSignatures<Bar, HttpRequestEvent>,
  Wew
> {
  wew: number;

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

export class Bar extends Component<Wew, Bar> {
  baz: number;

  Declared: 'baz';

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
httpRequest.connectToEvent(() => [new Wew(), new Bar()]);

export type IEvent = HttpRequestEvent & Wew & Bar;

export const http = [httpRequest, new HttpRequestActor()];
