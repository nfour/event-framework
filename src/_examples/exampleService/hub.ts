import fetch from 'node-fetch';
import { setInterval } from 'timers';

import { Hub } from '../../components/Hub';
import { httpServer } from './server';

const hub = new Hub();

hub.connect(httpServer);
hub.start();

setInterval(async () => {
  console.info('-------------------------- FETCH');
  await fetch(`${httpServer.uri}/foo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      n: 20,
    }),
  });
}, 2000);

/**
 * How it works:
 *
 * (HttpServer input)
 * - hub emits a `start` event
 * - httpServer listens on that, then starts its server up
 * - http server has an endpoint routed to action `foo`
 * - we send a fetch request to that endpoint
 * - httpServer passes a HttpRequestEvent event to `foo`
 * - middleware components catch it, turn it into an `execute` event (the only thing actions understand)
 * - it executes
 * - the result is used as a response to the incoming request in httpServer
 *
 * (HttpLambda input)
 * - HttpLambda is instantiated with an Action, `foo`
 * - HttpLambda.handler() returns a lambda handler that emits a `HttpRequestEvent` to `foo`
 * - middlewares execute `foo` and respond
 */
