import { IInputLambdaHttpEvent } from '../../index';

const baseEvent = <IInputLambdaHttpEvent> {
  body: '{}',
  headers: { 'content-type': 'application/json' },
  httpMethod: 'POST',
  path: '/',
  pathParameters: {},
  queryStringParameters: {},
  requestContext: {},
};

describe('HttpLambda function plusOne', () => {
  it('executes', async () => {
    const { plusOneHandler } = await import('../httpLambda');

    const response = await plusOneHandler({
      ...baseEvent,
      body: JSON.stringify({ n: 5 }),
    }, {}, () => null);

    expect(response).toMatchObject({
      statusCode: 200,
      body: 20,
    });
  });
});

describe('HttpLambda function timesTwo', () => {
  it('executes', async () => {
    const { timesFourHandler } = await import('../httpLambda');

    const response = await timesFourHandler({
      ...baseEvent,
      body: JSON.stringify({ n: 100 }),
    }, {}, () => null);

    expect(response).toMatchObject({
      body: 400,
    });
  });
});
