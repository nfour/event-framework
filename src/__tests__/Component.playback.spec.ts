import { delay } from 'bluebird';
import { Component } from '..';

it('exhibits playback within timeout', async () => {
  const component = new Component<any>();

  const expected = 1;
  let actual: number;

  component.playback = 100;
  component.debug = true;

  await component.emit('foo', expected);

  await delay(10);

  component.on('foo', (v: typeof actual) => {
    actual = v;
  });

  await delay(20);

  expect(actual!).toBe(expected);

});
it('does not exhibit playback after timeout', async () => {
  const component = new Component<any>();

  const expected = 1;
  let actual: number|undefined;

  component.playback = 10;

  await component.emit('foo', expected);

  await delay(20);

  component.on('foo', (v: typeof expected) => {
    actual = v;
  });

  expect(actual).toBe(undefined);
});
it('does not exhibit playback when disabled', async () => {
  const component = new Component<any>();

  const expected = 1;
  let actual: number|undefined;

  component.playback = false;

  await component.emit('foo', expected);

  await delay(1);

  component.on('foo', (v: typeof expected) => {
    actual = v;
  });

  await delay(1);

  expect(actual).toBe(undefined);
});
