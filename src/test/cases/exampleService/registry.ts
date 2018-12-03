import { resolve } from 'path';

import { Registry } from '../../../components/Registry';

export const registry = new Registry([
  {
    fork: false,
    name: 'foo',
    type: 'module',
    module: {
      member: 'foo',
      path: resolve(__dirname, './foo'),
    },
  },
]);
