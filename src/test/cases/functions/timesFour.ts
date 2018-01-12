import { Action } from '../../../components/Action';
import { httpBundle } from './middlewares';

const multiply = new Action(({ n, multiplier }) => n * multiplier);

export const timesFour = new Action(async ({ request: { body } }) => {
  const multiplied: number = await multiply.execute({ n: body.n, multiplier: 4 });

  return {
    statusCode: 200,
    body: multiplied,
  };
});

timesFour.connect(httpBundle);
