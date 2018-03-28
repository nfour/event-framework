import { Component } from '../Component';

class TestComponent extends Component<any> {}

it('events are executed in order of priority', async () => {
  const component = new TestComponent();

  const order: number[] = [];

  const listeners = [
    { callback: () => order.push(4), priority: 1 },
    { callback: () => order.push(1), priority: 122 },
    { callback: () => order.push(3), priority: 33 },
    { callback: () => order.push(2), priority: 99 },
    { callback: () => order.push(5), priority: Infinity },
  ];

  listeners.forEach((listener) => {
    component.prioritize(listener.priority).on('foo', listener.callback);
  });

  await component.emit('foo');

  expect(order).toEqual([1, 2, 3, 4, 5]);
});
