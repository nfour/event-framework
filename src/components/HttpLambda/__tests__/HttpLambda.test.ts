import { HttpLambda } from '../';
import { IHttpRequestResponse, IInputLambdaHttpContext, IInputLambdaHttpEvent, ILambdaHttpHandler } from '../../../';
import { Action } from '../../Action';
import { HttpRequest, HttpRequestActor, HttpRequestEvent } from '../../HttpRequest';
import { HttpAction } from '../../HttpRequest/HttpAction';

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

const httpBundle = [new HttpRequest(), new HttpRequestActor()];

type ISimpleActionEvent = HttpRequestEvent & { request: HttpRequestEvent['request'] & { body: { n: number }} };
type ISimpleActionResponse = IHttpRequestResponse & { body: number };

const simpleAction = new HttpAction<ISimpleActionEvent, ISimpleActionResponse>(({ request: { body } }) => {
  return {
    statusCode: 200,
    body: body.n + 1,
  };
});

simpleAction.connect(httpBundle);

const actionHandler = new HttpLambda(simpleAction).handler();

const executeLambda = (handler: ILambdaHttpHandler, event: IInputLambdaHttpEvent) =>
  new Promise<IHttpRequestResponse>((resolve, reject) => {
    handler(event, context, (err, res) => {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });

it('Executes the handler correctly', async () => {
  const response = await executeLambda(actionHandler, {
    ...baseEvent,
    body: JSON.stringify({ n: 5 }),
  });

  expect(response).toMatchObject({
    statusCode: 200,
    body: 6,
  });
});
