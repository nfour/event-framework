import { IRouterContext } from 'koa-router';
import { IHttpMethod } from '../../index';
import { ILambdaHandlerInputArgs } from '../../types';
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

export function createLambdaInputFromHttpRequestEvent (
  event: HttpRequestEvent,
  done: (err: Error|undefined, response: any) => void,
): ILambdaHandlerInputArgs {
  return [
    {
      body: JSON.stringify(event.request.body),
      headers: event.request.headers,
      httpMethod: event.request.method,
      path: event.request.path,
      pathParameters: event.request.params, // TODO:
      queryStringParameters: event.request.query,
      requestContext: {},
    },
    {}, // TODO: this needs to mock some stuff we use in service-library
    done,
  ];
}
