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

const reg = new Registry(moduleConfig);

const foo = reg.get<typeof action1>('foo');

void (async () => {
  const fooExecution = foo.emit('execute', { wew: true });

  await reg.initialize();

  const result = await fooExecution;
  console.dir({ result });
})();
