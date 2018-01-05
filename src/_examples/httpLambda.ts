import { HttpLambda } from '../components/HttpLambda';
import { Hub } from '../components/Hub';
import { ILambdaHttpHandler } from '../types/index';
import { plusOne } from './functions/plusOne';
import { timesFour } from './functions/timesFour';

const hub = new Hub();

hub.connect(plusOne);
hub.connect(timesFour);

// Currently necessary to annotate due to a TS issue with declaration files (because its a library, not a project)
export const plusOneHandler: ILambdaHttpHandler = new HttpLambda(plusOne).handler();
export const timesFourHandler: ILambdaHttpHandler = new HttpLambda(timesFour).handler();

hub.start();
