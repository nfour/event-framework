# Introduction

- [Introduction](#introduction)
  - [Concepts](#concepts)
  - [Components](#components)
    - [Proxy Components & the Registry](#proxy-components-the-registry)
    - [Component Signatures](#component-signatures)

## Concepts

The framework is designed to feature these concepts:

- `Component`
- `ProxyComponent`

And out of the box leverage these integrations & event sources:
- `HttpServer`
- `HttpLambda` (AWS)

## Components

Components are the base of the framework.

- Components are event emitters
- Everything extends a component
- Components can connect & disconnect from each other

This is a basic component:

```ts
import { Component } from 'reaco';

class Animal extends Component<any, Animal> {
  constructor () {
    super();

    this.subscribe('food', 'water');
    this.declare('sleep', 'wake');

    this.on('food', async (food) => { this.consume(food) })
    this.on('water', async (water) => { this.consume(water) })

    const day = 8640000 // 24 hours

    setInterval(async () => {
      await this.emit('sleep', this)

      const eightHours = 28800000;

      await delay(eightHours)

      await this.emit('wake')
    }, day)
  }

  private consume () { /* ... */ }
}

class Habitat extends Component<any, Habitat> {
  constructor () {
    super();

    this.declare('food', 'water', 'weather');
    this.populate();
  }

  private populate () { /* Lets assume this emits `food` and `water` */ }
}
```

Now we can connect them together

```ts
const animal = new Animal();
const habitat = new Habitat();

animal.connect(habitat);
```

When the connection occurs:
- `Animal` **only** wants to know about `water` and `food`
- `Habitat` emits **only** `water` and `food` to `Animal`
- `Habitat` doesn't care about `Animal`, and it remains unchanged


### Proxy Components & the Registry

Proxy components simply allow you mimic a component even though you do not own a line of its code.

Imagine this scenario:
- Component `Red` is in process 1
- Component `Blue` is in process 2
- Component `Yellow` is also in process 2
- Component `Spectrum` is in process 3

```ts
import { Registry } from 'reaco';
import { configs } from './configs';

const registry = new Registry(configs);

const red = registry.get('red');
const green = registry.get('green')
const yellow = registry.get('yellow')
const spectrum = registry.get('spectrum')

spectrum.connect(red, green, yellow);

spectrum.emit('color.red');
spectrum.emit('color.green');

spectrum.on('yellow', console.log);
```

> Yellow:

```ts
class Yellow extends Component<Spectrum, Yellow> {
  constructor () {
    super();

    let hasRed = false;
    let hasGreen = false;

    const emitYellow = () => {
      if (hasRed && hasGreen) {
        this.emit('yellow');
      }
    }

    this.on('color.red', () => {
      hasRed = true;
      emitYellow();
    });

    this.on('color.green', () => {
      hasBlue = true;
      emitYellow();
    });
  }
}

export const yellow = new Yellow();
```

In the above example we are leveraging the Registry in order to message between components, which could be anywhere.


### Component Signatures

It can be confusing dealing with events as their payloads typically must be explicitly defined by the consumer of an event payload.

Components have the ability to be decorated with constraints which solve this:

```ts

class Red extends Component<IComponent, Red> {
  Emit: {
    (name: 'red', self: Red);
  };

  On: (
    IOn<{ name: 'red', self: Red }> &
  );

  Declared: 'red'
}

class Blue extends Component<Red, Blue> {
  Emit: {
    (name: 'ready', self: Blue);
    (
      name: 'fooRequest',
      event: MyRequest,
    ): Promise<MyResponse>;
  };

  On: (
    IOn<{ name: 'ready', self: Blue }> &
    IOn<{
      name: 'fooRequest',
      event: MyRequest,
      return: Promise<MyResponse>;
    }>
  );

  Declared: (
    'ready' | 'MyResponse'
  );

  constructor () {
    super();

    // ...

    this.subscribe('red')
    this.subscribe('purple') // error, not declared
  }
}

```

Now in another file or project:

```ts

const blue = new Blue();

void (async () => {
  blue.on('ready', (blueInstance /* Foo */) => {
    // ...
  });

  // Inherits `Red` component events!
  blue.on('red', (redInstance /* Red */) => {
    // ...
  })

  await blue.emit('request', 1234 /* TS error, {} does not match MyRequest */)
})
```
