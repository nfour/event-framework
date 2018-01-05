import { Action } from '../../components/Action';
import { Http } from '../../middlewares/Http';

export const plusOne = new Action(({ request: { body } }) => {
  return {
    statusCode: 200,
    body: body.n + 1,
  };
})
  .use(Http());
