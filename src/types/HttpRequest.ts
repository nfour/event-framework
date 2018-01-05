import { IOn } from '../';
import { HttpRequestEvent } from '../components/HttpRequestEvent';
import { IHttpRequestResponse } from './';

export abstract class HttpRequest {
  Emit: {
    (
      name: ('http.request' | 'http.request.response'),
      event: HttpRequestEvent,
    );
  };

  On: (
    IOn<{
      name: 'http.request' | 'http.request.response',
      event: HttpRequestEvent,
      return: Promise<IHttpRequestResponse>|IHttpRequestResponse,
    }>
  );

  Declared: ('http.request' | 'http.request.response');
  Subscribed;
}
