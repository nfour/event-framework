import { action1 } from './actions';
import { Registry } from './Registry';
import { IRegistryConfig } from './types/registry';

const action1Module = {
  path: './actions',
  member: 'action1',
};

export const moduleConfig: IRegistryConfig = [
  {
    name: 'foo',
    type: 'module',
    module: action1Module,
  },
];

test('execution after initialization', async () => {
  const registry = new Registry(moduleConfig);

  const foo = registry.get<typeof action1>('foo');

  const fooExecution = foo.emit('execute', { wew: true });

  await registry.initialize();

  const result = await fooExecution;

  expect(result).toMatchObject({ statusCode: 200 });
});
