import fetch from 'node-fetch';
import { setInterval } from 'timers';
import { Component } from '../Component';
import { HttpServer } from '../components/HttpServer/HttpServer';
import { Hub } from '../components/Hub';
import { plusOne } from './functions/plusOne';
import { timesFour } from './functions/timesFour';

const hub = new Hub();

// Connect the components to the hub
hub.connect(plusOne);
hub.connect(timesFour);

const httpServer = new HttpServer({
  host: '0.0.0.0',
  port: 8888,
});

const HttpLoggerAsFactory = () => {
  const component = new Component<HttpServer>();

  component.subscribe('HttpServer.request');

  component.tap().on('HttpServer.request', ({ request }): any => {
    console.dir(request, { colors: true });
  });

  return component;
};

class HttpLoggerAsClass extends Component<HttpServer> {
  constructor () {
    super();

    this.subscribe('HttpServer.request');

    this.tap().on('HttpServer.request', ({ request }): any => {
      console.dir(request, { colors: true });
    });
  }
}

httpServer.route('PUT, POST /foo/bar').to(plusOne);
httpServer.route('POST /baz').to(timesFour);

hub.connect(httpServer);
hub.connect(HttpLoggerAsFactory());
hub.connect(new HttpLoggerAsClass());

timesFour.on('execute.complete', (result) => {
  console.dir({ timesFour: result });
});

plusOne.on('execute.complete', (result) => {
  console.dir({ plusOne: result });
});

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

setInterval(async () => {
  await fetch(`${httpServer.uri}/foo/bar`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      n: 10,
    }),
  });
}, 5000);
