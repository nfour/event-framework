import { resolve } from 'path';

import { IRegistryConfig } from '../../../types';
import { Registry } from '../../Registry';
import { action1 } from './actions';

export const moduleConfig: IRegistryConfig = [
  {
    type: 'module',
    name: 'foo',
    fork: true,
    module: {
      path: resolve(__dirname, './actions'),
      member: 'action1',
    },
    component: {
      subscriptions: ['execute'],
      declarations: ['execute.complete'],
    },
  },
];

test('execution after initialization', async () => {
  const registry = new Registry(moduleConfig);

  const foo = registry.get<typeof action1>('foo');

  foo.all().on((event, ...args) => {
    // tslint:disable-next-line:no-console
    console.log('[[[MASTER]]]\n', event, ...args);
  });

  await registry.initialize();

  const result = await foo.emit('execute', { wew: true });

  expect(result).toMatchObject({ statusCode: 200 });
});
