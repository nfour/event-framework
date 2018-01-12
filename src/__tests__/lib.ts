import { IHttpRequestResponse, IInputLambdaHttpEvent, ILambdaHttpHandler } from '../types';

export const executeLambda = (handler: ILambdaHttpHandler, event: IInputLambdaHttpEvent) =>
  new Promise<IHttpRequestResponse>((resolve, reject) => {
    handler(event, {}, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
