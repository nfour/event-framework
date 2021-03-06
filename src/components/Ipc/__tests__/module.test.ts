import { resolve } from 'path';

import { IRegistryConfig } from '../../../types';
import { Registry } from '../../Registry';
import { action1 } from './actions';

export const moduleConfig: IRegistryConfig = [
  {
    name: 'foo',
    type: 'module',
    module: {
      path: resolve(__dirname, './actions'),
      member: 'action1',
    },
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
