import { IRouterContext } from 'koa-router';
import { v4 as uuid } from 'uuid';
import { IHttpMethod, IHttpRequestEvent } from '../../index';

export function createEventFromKoa ({
  request: {
    body, headers, method, path, query,
  },
  params,
}: IRouterContext): IHttpRequestEvent {
  return {
    id: uuid(),
    error: undefined,
    response: undefined,
    request: {
      body, headers,
      path, query, params,
      method: method as IHttpMethod,
    },
  };
}
