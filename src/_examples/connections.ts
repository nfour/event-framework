import fetch from 'node-fetch';
import { setInterval } from 'timers';
import { Component } from '../Component';
import { Action } from '../components/Action';
import { HttpRequest } from '../components/HttpRequest';
import { HttpRequestActor } from '../components/HttpRequest/HttpRequestActor';
import { HttpRequestEvent } from '../components/HttpRequest/HttpRequestEvent';
import { HttpServer } from '../components/HttpServer/HttpServer';
import { Hub } from '../components/Hub';

const hub = new Hub();

const httpServer = new HttpServer({
  host: '0.0.0.0',
  port: 8888,
});

// TODO: if this instead extended a special EventComponent we could annotate
// the event structure and allow for intersecting together events
class WewMiddleware extends Component<HttpRequestEvent, WewMiddleware> {
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

class BarMiddleware extends Component<HttpRequestEvent, BarMiddleware> {
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

const foo = new Action<BarMiddleware & WewMiddleware & HttpRequest>((event) => {
  console.dir(Date.now());

  return event.baz * 5; // 1000
});

// HTTP BUNDLE

const http = new HttpRequest();
const httpActor = new HttpRequestActor();

http.connectOn('HttpRequestEvent', new WewMiddleware(), new BarMiddleware());

// END HTTP BUNDLE

foo.connect(httpActor, http);

httpServer.route('PUT, POST /foo').to(foo);

hub.connect(httpServer);
hub.start();

setInterval(async () => {
  await fetch(`${httpServer.uri}/foo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      n: 20,
    }),
  });
}, 2000);
