# Introduction

- [Introduction](#introduction)
  - [Concepts](#concepts)
  - [Components](#components)

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
import { Component } from 'event-framework';

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

class Habitat extends Compoinent<any, Habitat> {

}
```
