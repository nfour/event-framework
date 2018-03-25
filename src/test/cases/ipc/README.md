# IPC

## Requirements

- Have mutliple registry configurations which depict components being in different locations
- Should be able to construct & connect to components in a config regardless of location

### Resources

- HttpAction: foo
  - Http bundle middlewares

### Scenario 2

A registry of

```ts
const remoteConfig = {
  fooBar: {
    type: 'netIpc',
    host: '0.0.0.0',
    port: 1338,
    component: 'fooBar'
  },
}
const localConfig = {
  fooBa: {
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

const fooBar = registry.get('fooBar')

new HttpServer().route('GET /fooBar').to(fooBar).start()

await registry.initialize();
```

In the above example, the `fooBar` component is not actually the component, but a proxy to it, sharing all events.
