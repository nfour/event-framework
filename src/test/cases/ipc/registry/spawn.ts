import { ModuleProxy } from './ModuleProxy';

const [path, member, name, type] = process.argv;

void (async () => {
  const proxy = new ModuleProxy({
    type: 'module', name,
    module: { path, member },
  });

  await proxy.initialize();

  // TODO: use a component here to wrap this component and push events through `process`
  // must listen on all events and pipe through all subscribed events
  // or, a whitelist of events could be passed in argv thus supporting .connect()
})();
