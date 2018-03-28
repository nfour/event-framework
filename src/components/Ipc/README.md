# IPC

A configuration looks like:

```ts
const remoteConfig = {
  fooBar: {
    name: 'foo',
    type: 'module',
    spawn: true,
    module: {
      path: resolve(__dirname, '..', './actions'),
      member: 'action1',
    },
  },
}
const localConfig = {
  fooBar: {
    name: 'foo',
    type: 'module',
    module: {
      path: resolve(__dirname, '..', './actions'),
      member: 'action1',
    },
  },
}
```

Should mean that `foo` and `bar` will resolve to a unique component which ideally does the same thing.

```ts
// Local
const registry = new Registry(config)

const fooBar = registry.get('fooBar')

new HttpServer().route('GET /fooBar').to(fooBar).start()

await registry.initialize();
```

In the above example, the `fooBar` component is not actually the component, but a proxy to it, sharing all events.
