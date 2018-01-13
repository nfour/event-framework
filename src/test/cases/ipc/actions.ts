import { HttpAction } from '../../../components/HttpRequest/HttpAction';

export const action1 = new HttpAction<any, any>(() => {
  return { statusCode: 200, body: 1 };
});

export const action2 = new HttpAction<any, any>(() => {
  return { statusCode: 200, body: 2 };
});
