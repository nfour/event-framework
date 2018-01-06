import { Component } from '../Component';
import { IMergeComponentSignatures, IOnHttpRequestEvent } from '../types/events';
import { HttpLambda } from './HttpLambda';
import { HttpServer } from './HttpServer';

export class HttpRequest extends Component<
  IMergeComponentSignatures<HttpServer, HttpLambda>,
  HttpRequest
> {
  On: (
    IOnHttpRequestEvent
  );

  Subscribed: 'HttpLambda.request' | 'HttpServer.request';
  Declared: 'http.request' | 'http.request.response';

  constructor () {
    super();

    this.declare('http.request');
    this.declare('http.request.response');

    this.subscribe('HttpServer.request');
    this.subscribe('HttpLambda.request');
  }
}
