import { delay } from 'bluebird';
import { resolve } from 'path';
import { action1 } from '../actions';
import { Registry } from '../../../../components/Registry/Registry';
import { IRegistryConfig } from '../types/registry';

export const moduleConfig: IRegistryConfig = [
  {
    name: 'foo',
    type: 'module',
    spawn: true,
    module: {
      path: resolve(__dirname, '..', './actions'),
      member: 'action1',
    },
  },
];

test('execution after initialization', async () => {
  const registry = new Registry(moduleConfig);

  const foo = registry.get<typeof action1>('foo');

  foo.all().on((event, ...args) => {
    console.log('[[[MASTER]]]\n', event, ...args);
  });

  await registry.initialize();

  const result = await foo.emit('execute', { wew: true });

  expect(result).toMatchObject({ statusCode: 200 });

});
