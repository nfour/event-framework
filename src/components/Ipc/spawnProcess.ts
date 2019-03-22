import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

/**
 * This file serves to provide a Node JS child process stage for
 * proxied components.
 */

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

  component.all().on(processProxy.emitToProcess);
  processProxy.all().on(component.emit);

  await processProxy.emit('ready');
})();
