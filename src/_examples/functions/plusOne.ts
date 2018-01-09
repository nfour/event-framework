import { Action } from '../../components/Action';
import { httpBundle } from './middlewares';

export const plusOne = new Action(({ request: { body } }) => {
  return {
    statusCode: 200,
    body: body.n + 1,
  };
});

plusOne.connect(httpBundle);
