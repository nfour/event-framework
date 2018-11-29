import { HttpLambda } from '../../../components/HttpLambda';
import { registry } from './registry';

export const fooHandler: any = new HttpLambda(registry.get('foo')).handler();
