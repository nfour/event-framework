import { ChildProcess } from 'child_process';

import { Component } from '../../../..';

export interface IProcessComponentMessage {
  event: string;
  payload: any[];
}

export class ProcessComponent extends Component<any> { // FIXME: any
  private process: ChildProcess;

  constructor (emitter: NodeJS.Process|ChildProcess) {
    super();

    this.process = <ChildProcess> emitter;

    this.process.on('message', (msg?: IProcessComponentMessage) => {
      if (!msg || !(msg instanceof Object)) { return; }

      const { event, payload } = msg;

      return super.emit(event, ...payload);
    });
  }

  emit = (event, ...payload) => {
    const message: IProcessComponentMessage = { event, payload };

    // TODO: impliment async await here
    return this.process.send(message);
  }
}
