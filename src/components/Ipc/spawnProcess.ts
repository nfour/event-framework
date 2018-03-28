#!/usr/bin/env ts-node

import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

// tslint:disable:no-console

const [, , path, member, name] = process.argv;

void (async () => {
  const processProxy = new ProcessComponent(process);

  const component = new ModuleProxy({
    name,
    type: 'module',
    fork: false,
    module: { path, member },
  });

  await component.initialize();

  processProxy.all().on((...args) => {
    console.log('[[[CHILD]]]\n', ...args);
  });

  component.all().on((...args) => {
    console.log('[[[CHILD]]]\t[[[[COMPONENT]]]\n', ...args);
  });

  component.all().on(processProxy.emitToProcess);
  processProxy.all().on(component.emit);

  await processProxy.emit('ready');
})();
