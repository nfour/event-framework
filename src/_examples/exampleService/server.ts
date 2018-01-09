import { HttpServer } from '../../components/HttpServer/HttpServer';
import { foo } from './foo';

export const httpServer = new HttpServer({
  host: '0.0.0.0',
  port: 8888,
});

httpServer.route('PUT, POST /foo').to(foo);
