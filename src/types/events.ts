import { IOn } from '../';
import { HttpRequestEvent } from '../components/HttpRequestEvent';
import { IHttpRequestResponse } from './';

export type IOnHttpRequestEvent = IOn<{
  name: 'http.request' | 'http.request.response',
  event: HttpRequestEvent,
  return: Promise<IHttpRequestResponse>|IHttpRequestResponse,
}>;
