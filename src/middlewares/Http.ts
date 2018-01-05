import { Component } from '../Component';
import { Action } from '../components/Action';

export function Http () {
  // TODO: dont use HttpServer, use a more generic "HttpInterface"
  return (component: Action & Component<any, any>) => {
    component.subscribe('http.request');

    component.on('http.request', async (event) => {
      const result = await component.execute(event);

      return result;
    });
  };
}
