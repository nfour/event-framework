import { Component } from '../Component';

class TestComponent extends Component<any> {}

it('overrides an events value', async () => {
  const component = new TestComponent();

  const firedEvents: string[] = [];

  const addEvent = (key) => firedEvents.push(key);

  component.all().on(addEvent);

  component.on('bar', () => 1);
  component.emit('foo');
  component.emit('bar');
  component.emit('baz');

  expect(firedEvents).toEqual(['foo', 'bar', 'baz']);
});
