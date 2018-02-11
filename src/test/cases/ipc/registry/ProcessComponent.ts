import { EventEmitter } from 'events';
import { Component } from '../../../..';

export interface IProcessComponentMessage {
  eventName: string;
  payload: any[];
}

export class ProcessComponent extends Component<any> { // FIXME: any
  private process: EventEmitter;

  constructor (emitter: EventEmitter) {
    super();

    this.process = emitter;

    this.process.on('message', (msg?: IProcessComponentMessage) => {
      if (!msg || !(msg instanceof Object)) { return; }

      const { eventName, payload } = msg;

      return this.emit.call(this, eventName, ...payload);
    });
  }

  emit = (...args) => {
    // TODO: impliment async await here
    (this.process.emit as any)(...args);
  }
}
