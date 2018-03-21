#!/usr/bin/env ts-node

import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

const [, , path, member, name] = process.argv;

void (async () => {
  console.dir(process.argv);
  console.dir(process.send);
  console.dir('');

  const component = new ModuleProxy({
    name,
    type: 'module',
    spawn: false,
    module: { path, member },
  });

  await component.initialize();

  const processProxy = new ProcessComponent(process);

  /**
   * TODO:
   * - This should work as per PoC for IPC
   * - Must be an issue with the event chaining. Need a simpler example and intrumentation throughout
   */

  process.on('message', (...args) => {
    console.log('process got', ...args);
  });

  processProxy.all().on((...args) => {
    console.log('processProxy got', ...args);
  });

  component.all().on((...args) => {
    console.log('component got', ...args);
  });

  component.all().on(processProxy.send);
  processProxy.all().on(component.emit);

  processProxy.send('ready');
})();
