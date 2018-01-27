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
  }
];

export const httpConfig: IRegistryConfig = [
  {
    name: 'foo',
    type: 'http',
    url: 'http://localhost:8909/foo',
  },
];
