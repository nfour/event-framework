import { Action } from '../../components/Action';

export const plusOne = new Action(({ request: { body } }) => {
  return {
    statusCode: 200,
    body: body.n + 1,
  };
});
