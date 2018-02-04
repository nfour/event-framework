import { Component } from '../Component';

class TestComponent extends Component<any> {}

it('overrides an events value', async () => {
  const component = new TestComponent();

  component.on('foo', () => {
    return 1;
  });
  component.on('foo', () => {
    return;
  });

  expect(await component.emit('foo')).toBe(undefined);
});

it('preserves a value via context', async () => {
  const component = new TestComponent();

  component.on('foo', () => {
    return 1;
  });
  component.on('foo', function () {
    return this.previousValue;
  });

  expect(await component.emit('foo')).toBe(1);
});
