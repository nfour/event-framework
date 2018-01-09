import fetch from 'node-fetch';
import { setInterval } from 'timers';

import { Hub } from '../../components/Hub';
import { httpServer } from './server';

const hub = new Hub();

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
