import { Action } from '../../components/Action';
import { middlewares } from './middlewares';

export const foo = new Action((event) => {
  console.dir({ fooExecute: Date.now() });

  return event.baz * 5; // 1000
});

foo.connect(...middlewares);
