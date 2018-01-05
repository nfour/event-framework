import { Component } from '../Component';

it('events are executed in order of priority', async () => {
  const component = new Component<any>();

  const order: number[] = [];

  const listeners = [
    { callback: jest.fn(() => order.push(4)), priority: 1 },
    { callback: jest.fn(() => order.push(1)), priority: 122 },
    { callback: jest.fn(() => order.push(3)), priority: 33 },
    { callback: jest.fn(() => order.push(2)), priority: 99 },
    { callback: jest.fn(() => order.push(5)), priority: Infinity },
  ];

  listeners.forEach((listener) => {
    component.priority(listener.priority).on('foo', listener.callback);
  });

  await component.emit('foo');

  expect(order).toEqual([1, 2, 3, 4, 5]);
});
