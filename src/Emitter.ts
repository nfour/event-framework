import { delay } from 'bluebird';
import { Event, IListenerConfig } from './Event';
import { IOnCallback } from './index';

export interface IOnConfig { priority?: IListenerConfig['priority']; limit?: IListenerConfig['limit']; }
export interface IOnceConfig { priority?: IListenerConfig['priority']; }

export async function emit (this: Emitter, key: string, ...payload: any[]): Promise<any> {
  const event = this._events.get(key);
  const allEvent = this._events.get('*');

  if (this.debug) { console.info(`emit\t${this.constructor.name}   ${key}`); }

  this.addPlayback(key, payload);

  if (!(event || allEvent)) { return; }

  const sendEvent = (e: Event, args: any[]) =>
    e.propagate(...args).catch(async (error) => {
      await this.emit('error', error);

      throw error;
    });

  const propagations: Array<Promise<void>> = [];

  if (event) {
    propagations.push(sendEvent(event, payload));
  }

  if (allEvent) {
    propagations.push(sendEvent(allEvent, [key, ...payload]));
  }

  const [result] = await Promise.all(propagations);

  return result;
}

export function once (this: Emitter, key: string, callback: IOnCallback, options: IOnceConfig = {}) {
  return this.on(key, callback, { ...options, limit: 1 });
}

export function on (this: Emitter, key: string, callback: IOnCallback, options: IOnConfig = {}) {
  const event = this._events.get(key) || new Event(key);

  if (this.debug) { console.info(`on\t${this.constructor.name}   ${key}`); }

  event.add({ ...options, callback });

  this._events.set(key, event);

  const playback = this._playback.get(key);

  if (playback) {
    playback.forEach((args) => event.propagate(...args));
  }

  return event;
}

/**
 * A component acts as both a subscriber and an event emitter.
 */
export class Emitter {
  debug: boolean = !!process.env.DEBUG_EMITTER;

  /**
   * If nothing has begun listening to an event after this
   * amount of (ms), the playback history is purged
   *
   * When set to `Infinity` this is never purged
   * When set to `false` no history is kept
   */
  playback: false|number = 1;

  /**
   * Emit an event, asynchronously.
   */
  emit = emit;
  on = on;

  /**
   * Add listener to an event, but only fire the callback once.
   *
   * Also returns a promise which resolves only when the callback is executed.
   */
  once = once;

  /** The event listeners */
  _events: Map<Event['key'], Event> = new Map();

  /**
   * A dict of event playback to ensure adding listeners can be done after
   * an event has been emit. This is useful for events like 'ready'.
   *
   * These payloads are pruned on a timeout
   */
  _playback: Map<Event['key'], any[][]> = new Map();

  /**
   * Listen on any and all events
   */
  all () {
    return {
      on: ((callback, options?) => this.on('*', callback, options)),
    };
  }

  /** Applys priority to the next .on() */
  prioritize <X extends this = this> (priority: number) {
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
    const event = this._events.get(key);

    if (!event) { return false; }

    const listener = event.get(callback);

    if (!listener) { return false; }

    if (this.debug) { console.info(`off\t${this.constructor.name}   ${key}`); }

    event.remove(listener);

    if (event.listeners.length < 1) {
      this._events.delete(key);
    }

    return true;
  }

  addPlayback (key: string, args: any[]) {
    if (this.playback === false) { return; }

    if (!this._playback.has(key)) {
      this._playback.set(key, []);

      this.setPlaybackTimeout(key);
    }

    const playback = this._playback.get(key)!;

    playback.push(args);
  }

  /** Purge playback after given timeout to prevent memory leaks */
  private setPlaybackTimeout (key: string): any {
    if (this.playback === Infinity) { return; }

    return delay(this.playback as number).then(() => {
      if (this._playback.has(key)) {
        this._playback.delete(key);
      }
    });
  }
}
