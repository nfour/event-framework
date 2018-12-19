import { formatRoutePathParams } from '../lib';

it('formats /foo/{bar}/baz to /foo/:bar/baz', () => {
  expect(
    formatRoutePathParams('/foo/{bar}/baz'),
  ).toBe(
    `/foo/:bar/baz`,
  );
});
