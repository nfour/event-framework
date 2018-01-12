import { HttpLambda } from '../../../components/HttpLambda';
import { foo } from './foo';

export const fooHandler: any = new HttpLambda(foo).handler();
