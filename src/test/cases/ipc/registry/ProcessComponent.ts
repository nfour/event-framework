import { ChildProcess } from 'child_process';

import { Component } from '../../../..';

export interface IProcessComponentMessage {
  eventName: string;
  payload: any[];
}

export class ProcessComponent extends Component<any> { // FIXME: any
  private process: ChildProcess;

  constructor (emitter: ChildProcess) {
    super();

    this.process = emitter;

    this.process.on('message', (msg?: IProcessComponentMessage) => {
      if (!msg || !(msg instanceof Object)) { return; }

      const { eventName, payload } = msg;

      return this.emit(eventName, ...payload);
    });
  }

  send = (eventName, ...args) => {

    const message: IProcessComponentMessage = {};
    // TODO: impliment async await here
    return this.process.send(message);
  }
}
