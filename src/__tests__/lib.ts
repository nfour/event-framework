import { IHttpRequestResponse, IInputLambdaHttpEvent, ILambdaHttpHandler } from '../types';

export function executeLambda (handler: ILambdaHttpHandler, event: IInputLambdaHttpEvent) {
  return new Promise<IHttpRequestResponse>((resolve, reject) => {
    // tslint:disable-next-line:no-floating-promises
    handler(event, {}, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
}
