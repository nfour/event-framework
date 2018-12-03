import { HttpAction } from '../../../components/HttpRequest/HttpAction';
import { IHttpRequestResponse } from '../../../index';
import { http, IEvent } from './middlewares';

export interface IMyFancyResponse extends IHttpRequestResponse {
  body: {
    foo: string;
  };
}

export const foo = new HttpAction<IEvent, IMyFancyResponse>((event) => {
  console.dir({ fooExecute: Date.now(), baz: event.baz, wew: event.wew });

  return {
    statusCode: 200,
    body: {
      foo: '3433',
    },
  };
});

foo.connect(http);
