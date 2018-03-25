import { ChildProcess } from 'child_process';
import * as uuid from 'uuid';

import { isObject } from 'lodash';
import { Component } from '../..';

export interface IProcessComponentMessage {
  event: string;
  reply?: string;
  payload: any[];
}

const REPLY_SUFFIX = '::<<REPLY>>';

export class ProcessComponent extends Component<any> { // FIXME: any
  private process: ChildProcess;

  constructor (emitter: NodeJS.Process|ChildProcess) {
    super();

    this.process = <ChildProcess> emitter;

    this.process.on('message', async (msg?: IProcessComponentMessage) => {
      if (!msg || !isObject(msg)) { return; }

      const { event, payload, reply } = msg;

      const result = await this.emitToSelf(event, ...payload);

      if (reply) {
        this.emitToProcess(reply, result);
      }
    });
  }

  emit = (event, ...payload) => {
    this.emitToSelf(event, ...payload);
    return this.emitToProcessWithReply(event, ...payload);
  }

  emitToProcess = (event, ...payload) => {
    const message: IProcessComponentMessage = {
      event, payload,
      reply: event.endsWith(REPLY_SUFFIX)
        ? undefined
        : `${uuid()}${REPLY_SUFFIX}`,
    };

    this.process.send(message);

    return message;
  }

  emitToProcessWithReply = (event, ...payload) => {
    const { reply } = this.emitToProcess(event, ...payload);

    if (!reply) { return; }

    return new Promise((resolve) => {
      this.once(reply, resolve);
    });
  }

  emitToSelf = (event, ...payload) => {
    return super.emit(event, ...payload);
  }
}
