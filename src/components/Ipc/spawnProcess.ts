#!/usr/bin/env ts-node

/**
 * This file serves to provide a Node JS child process stage for
 * proxied components.
 */

import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

// tslint:disable:no-console

type IExpectedArgs = [
  string, string, string, string, string, ModuleProxy['type']
];

const [, , path, member, name, type] = <IExpectedArgs> process.argv;

void (async () => {
  const processProxy = new ProcessComponent(process);

  const component = new ModuleProxy({
    name, type,
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
