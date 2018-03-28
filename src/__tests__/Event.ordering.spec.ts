import { Event } from '../Event';

it('sorts by priority', async () => {
  const event = new Event('foo');

  const order: number[] = [];

  const listeners = [
    { callback: () => order.push(4), priority: 1 },
    { callback: () => order.push(1), priority: 122 },
    { callback: () => order.push(3), priority: 33 },
    { callback: () => order.push(2), priority: 99 },
    { callback: () => order.push(5), priority: Infinity },
  ];

  listeners.forEach((listener) => event.add(listener));

  await event.propagate('foo');

  expect(order).toEqual([1, 2, 3, 4, 5]);
});

it('should sort by insertion order by default', async () => {
  const event = new Event('foo');

  const order: number[] = [];

  const listeners = [
    { callback: () => order.push(1) },
    { callback: () => order.push(2) },
    { callback: () => order.push(3) },
  ];

  listeners.forEach((listener) => event.add(listener));

  await event.propagate('foo');

  expect(order).toEqual([1, 2, 3]);
});
