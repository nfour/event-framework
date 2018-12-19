import { Server } from 'http';
import * as Koa from 'koa';
import * as BodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';

import { Component } from '../../Component';
import { IOn } from '../../index';
import { HttpRequestEvent } from '../HttpRequest/HttpRequestEvent';
import { Hub } from '../Hub';
import { createEventFromKoa, formatRoutePathParams } from './lib';

export interface IRouteConfig {
  methods: string[];
  path: string;
  component: Component<HttpServer>;
}

/**
 * This acts as a http event emitter, maintaining routes to components
 * and specifically emitting to those components based on routes
 */
export class HttpServer extends Component<Hub, HttpServer> {
  Emit: {
    (name: 'HttpServer.ready', component: HttpServer);
    (
      name: 'HttpRequestEvent.prepare',
      event: HttpRequestEvent,
    ): Promise<HttpRequestEvent> | HttpRequestEvent;
  };

  On: (
    IOn<{ name: 'HttpServer.ready', event: HttpServer }> &
    IOn<{
      name: 'HttpRequestEvent.prepare',
      event: HttpRequestEvent,
      return: Promise<HttpRequestEvent> | HttpRequestEvent;
    }>
  );

  Declared: (
    'HttpRequestEvent.prepare' |
    'HttpServer.ready'
  );

  port: number;
  host: string;
  protocol: 'http' | 'https' = 'http';

  routes: Map<string, {
    methods: string[],
    path: string,
    component: Component<any, any>,
  }> = new Map();

  server: Server;

  protected app: Koa;
  protected router: Router;

  constructor (config: {
    port: HttpServer['port'],
    host: HttpServer['host'],
  }) {
    super();

    Object.assign(this, config);

    this.subscribe('start');

    this.declare('HttpRequestEvent.prepare', 'HttpServer.ready');

    this.router = new Router();
    this.app = new Koa();

    this.app.use(BodyParser());
    this.app.use(this.router.routes());

    this.on('start', () => {
      this.server = this.app.listen({ port: this.port, host: this.host }, async () => {
        return this.emit('HttpServer.ready', this);
      });
    });
  }

  get uri () {
    const port = this.port === 80 ? '' : `:${this.port}`;

    return `${this.protocol}://${this.host}${port}`;
  }

  /**
   * Routes a path to a component
   *
   * @param routePath A path resembling `POST, PUT /foo/bar` format
   */
  route (routePath: string) {
    // TODO: test this fn
    const matches = routePath.match(/((?:[A-Z]+(?:,\s*)?){1,}) (.+)/);

    if (!matches) { throw new Error(`Invalid routePath: ${routePath}`); }

    const [, method, path] = matches;

    const methods = method.split(/,\s*/g);

    return {
      to: (component: Component<any, any>): HttpServer => {
        this.connect(component);
        this.registerRoute({ methods, path, component });

        return this;
      },
    };
  }

  private registerRoute ({ component, methods, path: inputPath }: IRouteConfig) {
    const path = formatRoutePathParams(inputPath);
    const middleware = this.createRequestMiddleware(component);

    this.routes.set(`${methods} ${path}`, { methods, path, component });
    this.router.register(path, methods, middleware);
  }

  private createRequestMiddleware = (component: Component<HttpServer>): Router.IMiddleware => {
    return async (ctx, next) => {
      const event = createEventFromKoa(ctx);

      // Component specific event, useful for instrumentation
      await component.emit('HttpRequestEvent.prepare', event);

      const { response } = event;

      if (!response) { return; }

      ctx.status = response.statusCode;
      ctx.body = response.body;
      ctx.set(response.headers || {});
    };
  }
}
