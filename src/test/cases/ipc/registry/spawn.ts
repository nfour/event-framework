#!/usr/bin/env ts-node

import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

const [, , path, member, name] = process.argv;

void (async () => {
  console.log(process.argv);
  console.log(process.send);
  const component = new ModuleProxy({
    name,
    type: 'module',
    spawn: false,
    module: { path, member },
  });

  await component.initialize();

  const processProxy = new ProcessComponent(process);

  component.all().on(processProxy.send);
  processProxy.all().on(component.emit);

  processProxy.send('ready');
})();
