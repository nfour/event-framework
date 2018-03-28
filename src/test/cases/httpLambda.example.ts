import { HttpLambda } from '../../components/HttpLambda';
import { ILambdaHttpHandler } from '../../types/index';
import { plusOne } from './functions/plusOne';
import { timesFour } from './functions/timesFour';

// Currently necessary to annotate due to a TS issue with declaration files (because its a library, not a project)
export const plusOneHandler: ILambdaHttpHandler = new HttpLambda(plusOne).handler();
export const timesFourHandler: ILambdaHttpHandler = new HttpLambda(timesFour).handler();
