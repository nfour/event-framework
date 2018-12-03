import fetch from 'node-fetch';
import { setInterval } from 'timers';

import { Hub } from '../../../components/Hub';
import { registry } from './registry';
import { httpServer } from './server';

const hub = new Hub();

hub.connect(httpServer);

registry.initialize().then(() => {
  hub.start();
});

setInterval(async () => {
  console.info('-------------------------- FETCH');
  const response = await fetch(`${httpServer.uri}/foo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      n: 20,
    }),
  });

  console.log(await response.json());
}, 2000);
