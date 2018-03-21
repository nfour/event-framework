import { resolve } from 'path';
import { action1 } from '../actions';
import { Registry } from '../registry/Registry';
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

  await registry.initialize();
  const fooExecution = foo.emit('execute', { wew: true });

  console.dir('init');

  const result = await fooExecution;

  console.dir('awaited');

  expect(result).toMatchObject({ statusCode: 200 });
});
