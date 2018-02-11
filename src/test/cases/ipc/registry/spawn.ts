import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

const [path, member, name] = process.argv;

void (async () => {
  const component = new ModuleProxy({
    name,
    type: 'module',
    spawn: false,
    module: { path, member },
  });

  await component.initialize();

  const processProxy = new ProcessComponent(process);

  component.all().on(processProxy.emit);
  processProxy.all().on(component.emit);
})();
