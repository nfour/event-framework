import { IHttpRequestEvent, IHttpRequestResponse } from '../../types';
import { Action } from '../Action';

/** Serves to provide default type information for an Action */
export class HttpAction<
  E extends IHttpRequestEvent = IHttpRequestEvent,
  R extends IHttpRequestResponse = IHttpRequestResponse
> extends Action<E, R> {}
