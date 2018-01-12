import { HttpLambda } from '../';
import { IHttpRequestResponse, IInputLambdaHttpEvent } from '../../..';
import { executeLambda } from '../../../test/lib';
import { HttpRequest, HttpRequestActor, HttpRequestEvent } from '../../HttpRequest';
import { HttpAction } from '../../HttpRequest/HttpAction';

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
