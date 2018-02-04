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

export type IDefferedPromise<V> = Promise<V> & { resolve, reject };

export function deferredPromise<V = any> (): IDefferedPromise<V> {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  Object.assign(promise, { resolve, reject });

  return promise as IDefferedPromise<V>;
}
