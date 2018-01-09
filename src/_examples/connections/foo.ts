import { Action } from '../../components/Action';
import { actorComponents } from './actorComponents';

export const foo = new Action((event) => {
  console.dir(Date.now());

  return event.baz * 5; // 1000
});

foo.connect(...actorComponents);
