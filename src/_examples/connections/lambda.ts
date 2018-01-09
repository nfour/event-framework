import { HttpLambda } from '../../components/HttpLambda';
import { foo } from './foo';

export const fooHandler = new HttpLambda(foo).handler();
