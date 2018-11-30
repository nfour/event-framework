import { readFileSync } from 'fs';
import { resolve } from 'path';

import { ModuleProxy } from '../ModuleProxy';

it('can generate a dependency tree of the resolved ModuleProxy component', async () => {
  const proxy = new ModuleProxy({
    fork: false,
    name: 'foo',
    type: 'function-action-module',
    module: {
      path: resolve(__dirname, './modules/foo.ts'),
      member: 'foo',
    },
  });

  const fooFn = readFileSync(resolve(__dirname, './modules/fixtures/foo.ts'));

  // TODO: make a staging dir which we write to with the above fn, changing its return value by overwriting it
  // Then add in dependency modules which we also save and proove dep tree reloading works!

});
