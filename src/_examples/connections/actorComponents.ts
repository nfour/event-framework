import { HttpRequest, HttpRequestEvent } from '../../components/HttpRequest';
import { HttpRequestActor } from '../../components/HttpRequest/HttpRequestActor';
import { Component } from '../../index';

export class WewMiddleware extends Component<HttpRequestEvent, WewMiddleware> {
  Subscribed: 'HttpRequestEvent';

  constructor () {
    super();

    this.subscribe('HttpRequestEvent');

    // Runs after BarMiddleware
    this.priority(2).on('HttpRequestEvent', async (event) => {
      event.wew = 100;

      console.dir({ wew: event.wew });

      await event.emit('WeW');
    });
  }
}

export class BarMiddleware extends Component<HttpRequestEvent, BarMiddleware> {
  Subscribed: 'HttpRequestEvent';

  constructor () {
    super();

    this.subscribe('HttpRequestEvent');

    // Runs before WewMiddleware
    this.priority(5).on('HttpRequestEvent', (event) => {
      event.subscribe('WeW');

      event.on('WeW', () => {
        event.baz = event.wew * 2; // 200

        console.dir({ baz: event.baz });

        return event.emit('BaZ');
      });
    });
  }
}

// Connections HttpLambda & HttpServer to HttpRequest
const http = new HttpRequest();

// Connects HttpRequest to Actions
const httpActor = new HttpRequestActor();

// Connects middlewares to event components
http.connectOn('HttpRequestEvent', new WewMiddleware(), new BarMiddleware());

export const actorComponents = [http, httpActor];
