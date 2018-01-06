import * as QueryString from 'qs';

import { IHttpBody, IInputLambdaHttpEvent } from '../../index';
import { normalizeHeaders } from '../../lib/http';
import { HttpRequestEvent } from '../HttpRequestEvent';

/**
 * Transforms lambda-proxy input to a request object
 */
export function createHttpEventFromLambda (event: IInputLambdaHttpEvent) {
  const {
    pathParameters: params,
    httpMethod: method,
    path,
  } = event;

  const query = QueryString.parse(
    QueryString.stringify(event.pathParameters || {}, { encode: false }),
  );

  const headers = normalizeHeaders(event.headers);

  let body: IHttpBody = event.body;

  // If content-type is JSON, try to parse it
  if (body && /\bapplication\/.*json\b/.test(headers['content-type'] || '')) {
    try {
      body = JSON.parse(<string> body);
    } catch (err) {
      throw new Error('Malformed JSON body');
    }
  }

  return new HttpRequestEvent({
    request: {
      headers, query, params,
      body, method, path,
    },
  });
}
