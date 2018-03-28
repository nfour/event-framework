import { ChildProcess } from 'child_process';
import * as uuid from 'uuid';

import { isObject } from 'lodash';
import { Component } from '../..';
import { emit } from '../../Emitter';

export interface IProcessComponentMessage {
  event: string;
  reply?: string;
  payload: any[];
}

export interface IProcessState {
  declarations?: string[];
  subscriptions?: string[];
  pid: number;
}

const REPLY_SUFFIX = '<<REPLY>>';

/**
 * The ProcessComponent provides an abstraction on a `process`
 * which holds a stateful connection to another ProcessComponent via IPC.
 */
export class ProcessComponent extends Component<any> {
  private process: ChildProcess;
  private relaying: Set<string> = new Set();

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

    /** Requests state from the process */
    this.on('process.state.request', () => {
      const params: IProcessState = {
        declarations: Array.from(this.declarations),
        subscriptions: Array.from(this.subscriptions),
        pid: this.process.pid,
      };

      return this.emitToProcess('process.state', params);
    });

    /** The reply for `process.state.request` */
    this.on('process.state', (state) => { this.syncState(state); });
  }

  // TODO: edit the forkProcess.ts file to use all this stuff now

  get state (): IProcessState {
    return {
      declarations: Array.from(this.declarations),
      subscriptions: Array.from(this.subscriptions),
      pid: this.process.pid,
    };
  }

  async syncState (state?: IProcessState) {
    if (!state) {
      state = <IProcessState> await this.emitToProcessWithReply('process.state.request');
    }

    this.readProcessComponentState(state);
    this.relaySubscriptionsToProcess();
  }

  emit = (event: string, ...payload) => {
    this.emitToSelf(event, ...payload);

    return this.emitToProcessWithReply(event, ...payload);
  }

  emitToProcess = (event: string, ...payload) => {
    const message: IProcessComponentMessage = {
      event, payload,
      reply: event.endsWith(REPLY_SUFFIX)
        ? undefined
        : `${uuid()}${REPLY_SUFFIX}`,
    };

    this.process.send(message);

    return message;
  }

  emitToProcessWithReply = (event: string, ...payload): Promise<any> => {
    const { reply } = this.emitToProcess(event, ...payload);

    if (!reply) { return Promise.resolve(); }

    return new Promise((resolve) => { this.once(reply, resolve); });
  }

  emitToSelf = (event: string, ...payload) => {
    return emit.call(this, event, ...payload);
  }

  private readProcessComponentState ({ subscriptions = [], declarations = [] }: IProcessState) {
    if (subscriptions.length) { this.subscriptions = new Set(subscriptions); }
    if (declarations.length) { this.declarations = new Set(declarations as any[]); }
  }

  private relaySubscriptionsToProcess () {
    this.subscriptions.forEach((event) => {
      if (this.relaying.has(event)) { return; }

      this.on(event, (...payload) => this.emitToProcessWithReply(event, ...payload));

      this.relaying.add(event);
    });
  }
}
