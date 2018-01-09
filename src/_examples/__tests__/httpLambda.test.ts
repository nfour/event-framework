import { IHttpRequestResponse, IInputLambdaHttpContext, IInputLambdaHttpEvent, ILambdaHttpHandler } from '../../index';

const context = <IInputLambdaHttpContext> {};

const baseEvent = <IInputLambdaHttpEvent> {
  body: '{}',
  headers: { 'content-type': 'application/json' },
  httpMethod: 'POST',
  path: '/',
  pathParameters: {},
  queryStringParameters: {},
  requestContext: {},
};

const executeLambda = (handler: ILambdaHttpHandler, event: IInputLambdaHttpEvent) =>
  new Promise<IHttpRequestResponse>((resolve, reject) => {
    handler(event, context, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });

describe('HttpLambda function plusOne', () => {
  it('executes', async () => {
    const { plusOneHandler } = await import('../httpLambda');

    const response = await executeLambda(plusOneHandler, {
      ...baseEvent,
      body: JSON.stringify({ n: 5 }),
    });

    expect(response).toMatchObject({
      body: 6,
    });
  });
});

describe('HttpLambda function timesTwo', () => {
  it('executes', async () => {
    const { timesFourHandler } = await import('../httpLambda');

    const response = await executeLambda(timesFourHandler, {
      ...baseEvent,
      body: JSON.stringify({ n: 100 }),
    });

    expect(response).toMatchObject({
      body: 400,
    });
  });
});
