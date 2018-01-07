import fetch from 'node-fetch';
import { setInterval } from 'timers';
import { Component } from '../Component';
import { Action } from '../components/Action';
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

      return event.emit('WewMiddleware');
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
      event.subscribe('WewMiddleware');

      event.on('WewMiddleware', () => {
        event.baz = event.wew * 2; // 200

        console.dir({ baz: event.baz });

        return event.emit('BazMiddleware');
      });
    });
  }
}

const foo = new Action<BarMiddleware & WewMiddleware>((event) => {
  return event.baz * 5; // 1000
});

foo.connect(new WewMiddleware(), new BarMiddleware());

httpServer.route('PUT, POST /foo').to(foo);

hub.connect(httpServer);
hub.start();

setInterval(async () => {
  await fetch(`${httpServer.uri}/baz`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      n: 20,
    }),
  });
}, 2500);
