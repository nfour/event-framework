import { Event, IListenerConfig } from './Event';
import { IOnCallback } from './index';

export interface IOnConfig { priority?: IListenerConfig['priority']; limit?: IListenerConfig['limit']; }
export interface IOnceConfig { priority?: IListenerConfig['priority']; }

/**
 * A component acts as both a subscriber and an event emitter.
 */
export abstract class Emitter {
  debug?: boolean = !!process.env.DEBUG_EMITTER;

  protected _events: { [key: string]: Event } = {};

  /**
   * Emit an event, asynchronously.
   */
  emit = async (key: string, ...payload: any[]): Promise<any> => {
    const event = this._events[key];

    if (this.debug) { console.info(`emit\t${this.constructor.name}   ${key}`); }

    if (!event) { return; }

    return event.propagate(...payload).catch(async (error) => {
      await this.emit('error', error);

      throw error;
    });
  }

  on = (key, callback: IOnCallback, options: IOnConfig = {}) => {
    const event = this._events[key] || new Event(key);

    if (this.debug) { console.info(`on\t${this.constructor.name}   ${key}`); }

    event.add({ ...options, callback });

    this._events[key] = event;
  }

  /**
   * Add listener to an event, but only fire the callback once.
   *
   * Also returns a promise which resolves only when the callback is executed.
   */
  once = (key, callback: IOnCallback, options: IOnceConfig = {}) => {
    return this.on(key, callback, { ...options, limit: 1 });
  }

  /** Applys priority to the next .on() */
  priority <X extends this = this> (priority: number) {
    return {
      on: <X['on']> ((key, callback, options = {}) => this.on(key, callback, { ...options, priority })),
    };
  }

  /** Allows execution of emitters on the next .on() without having to return anything */
  tap <X extends this = this> () {
    return {
      on: <X['on']> ((key, callback, options = {}) => {
        return this.on(key, async function (...args) {
          await callback.apply(this, args);

          return this.previousValue;
        }, options);
      }),
    };
  }

  /** Remove a listener which matches `callback` */
  off = (key: string, callback) => {
    const event = this._events[key];

    if (!event) { return false; }

    const listener = event.get(callback);

    if (!listener) { return false; }

    if (this.debug) { console.info(`off\t${this.constructor.name}   ${key}`); }

    event.remove(listener);

    return true;
  }
}
