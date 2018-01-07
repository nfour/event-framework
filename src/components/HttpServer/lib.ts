import { IRouterContext } from 'koa-router';
import { IHttpMethod } from '../../index';
import { HttpRequestEvent } from '../HttpRequest/HttpRequestEvent';

export function createEventFromKoa ({
  request: {
    body, headers, method, path, query,
  },
  params,
}: IRouterContext) {
  return new HttpRequestEvent({
    request: {
      body, headers,
      path, query, params,
      method: method as IHttpMethod,
    },
  });
}
