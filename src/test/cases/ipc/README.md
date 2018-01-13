# IPC

## Requirements

- Have mutliple registry configurations which depict components being in different locations
- Should be able to construct & connect to components in a config regardless of location

### Resources

- HttpAction: foo
  - Http bundle middlewares

### Scenario 1

The http bundle also includes an IPC middleware to act like HttpServer as a HttpRequestEvent source

The registry would instantiate the `httpIpcRelay` component

```ts
foo.connect(httpRequest)
```

To route that particular action to the IPC event, we would have to connect to HttpServer

```ts
httpRequest.connect(httpServer)
httpServer.connect(httpIpcRelay)
```

Which would be fed http requests of a post-parsed interface.

### Scenario 2

A registry of

```ts
const config = {
  fooBarRemote: {
    type: 'netIpc',
    host: '0.0.0.0',
    port: 1338,
    component: 'fooBar'
  },
  fooBarLocal: {
    type: 'local',
    path: 'components/fooBar.fooBar',
    component: 'fooBar
  },
}
```

Should mean that `foo` and `bar` will resolve to a unique component which ideally does the same thing.

```ts
// Local
const registry = new Registry(config)

const fooBar = registry.get('fooBarRemote')

new HttpServer().route('GET /fooBar').to(fooBar)

registry.resolve();
```

To break this down for the `netIpc` component:
- A new registry config points to the location of components
- .get() retrieves a component by unique name which acts as a relay between the remote and local source
- `HttpServer` emits a `HttpRequestEvent` to `fooBar`
- `fooBar` then emits `HttpRequestEvent` to the `netIpc` relay, which sends a new event to `0.0.0.0:1338`
  - Shaped like `{ name: 'HttpRequestEvent', component: 'fooBar', args: [{ <serializedStuff> }] }`
- At that address another registry is listening for events and eventually executes:

```ts
// Remote
const wrappedComponent: IpcComponent = components.get('fooBar')

// Passes the event to the underlying `fooBar` Action component in a way which does not trigger an infinite loop of events
wrappedComponent.passEvent('HttpRequestEvent', ...event.args);
```

- The remote `fooBar` then parses the request with its middlewares etc. and they eventually emit a `http.request.response`
- `http.request.response` is sent back to the `local` registry and `.passEvent()` to `fooBar`
- `HttpServer` is listening for a response and then returns.

In the above examples, `args` would be serializable and NOT an emitter itself. This must be handled one layer down, http server would emit a payload which act as arguments to the HttpRequestEvent component, which would be constructed when necessary. The entire lifecycle of such a event component would exist on the `remote` side.

The `local` version could be achieved with

```ts
const fooBar = registry.get('fooBarLocal')
```

Where the above would execute entirely locally.
