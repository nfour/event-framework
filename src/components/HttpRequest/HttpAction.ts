import { IHttpRequestResponse } from '../../types';
import { Action } from '../Action';
import { HttpRequestEvent } from './index';

/** Serves to provide default type information for an Action */
export class HttpAction<
  E extends HttpRequestEvent = HttpRequestEvent,
  R extends IHttpRequestResponse|Promise<IHttpRequestResponse> = IHttpRequestResponse|Promise<IHttpRequestResponse>
> extends Action<E, R> {}
