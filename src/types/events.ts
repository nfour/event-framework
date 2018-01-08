import { IComponent, IComponentSignaturesGeneric, IOn } from '../';
import { HttpRequestEvent } from '../components/HttpRequest/HttpRequestEvent';
import { IHttpRequestResponse } from './';

export type IOnHttpRequestEvent = IOn<{
  name: 'http.request' | 'http.request.response',
  event: HttpRequestEvent,
  return: Promise<IHttpRequestResponse>|IHttpRequestResponse,
}>;

export interface IEventComponent {
  announce ();
}

export interface IMergeComponentSignatures<
  A extends IComponentSignaturesGeneric,
  B extends IComponentSignaturesGeneric,
  C extends IComponentSignaturesGeneric = IComponent,
  D extends IComponentSignaturesGeneric = IComponent,
  E extends IComponentSignaturesGeneric = IComponent,
  F extends IComponentSignaturesGeneric = IComponent
> {
  Emit: (
    A['Emit'] &
    B['Emit'] &
    C['Emit'] &
    D['Emit'] &
    E['Emit'] &
    F['Emit']
  );

  On: (
    A['On'] &
    B['On'] &
    C['On'] &
    D['On'] &
    E['On'] &
    F['On']
  );

  Declared: (
    A['Declared'] |
    B['Declared'] |
    C['Declared'] |
    D['Declared'] |
    E['Declared'] |
    F['Declared']
  );

  Subscribed: (
    A['Subscribed'] |
    B['Subscribed'] |
    C['Subscribed'] |
    D['Subscribed'] |
    E['Subscribed'] |
    F['Subscribed']
  );
}
