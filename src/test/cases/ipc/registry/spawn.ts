
const [path, member] = process.argv;

void (async () => {
  const component = await import(path)[member];

  // TODO: use a component here to wrap this component and push events through `process`
  // must listen on all events and pipe through all subscribed events
  // or, a whitelist of events could be passed in argv thus supporting .connect()
})();
