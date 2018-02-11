import { ModuleProxy } from './ModuleProxy';
import { ProcessComponent } from './ProcessComponent';

const [path, member, name] = process.argv;

void (async () => {
  const proxy = new ModuleProxy({
    name,
    type: 'module',
    spawn: false,
    module: { path, member },
  });

  await proxy.initialize();

  const processProxy = new ProcessComponent(process);

  // TODO: use a component here to wrap this component and push events through `process`
  // must listen on all events and pipe through all subscribed events
  // or, a whitelist of events could be passed in argv thus supporting .connect()
})();
