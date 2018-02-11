import { delay } from 'bluebird';
import { Event, IListenerConfig } from './Event';
import { IOnCallback } from './index';

export interface IOnConfig { priority?: IListenerConfig['priority']; limit?: IListenerConfig['limit']; }
export interface IOnceConfig { priority?: IListenerConfig['priority']; }

/**
 * A component acts as both a subscriber and an event emitter.
 */
export abstract class Emitter {
  debug: boolean = !!process.env.DEBUG_EMITTER;

  /**
   * If nothing has begun listening to an event after this
   * amount of (ms), the playback history is purged
   *
   * When set to `Infinity` this is never purged
   * When set to `false` no history is kept
   */
  playback: false|number = 1;

  /** The event listeners */
  protected _events: Map<Event['key'], Event> = new Map();

  /**
   * A dict of event playback to ensure adding listeners can be done after
   * an event has been emit. This is useful for events like 'ready'.
   *
   * These payloads are pruned on a timeout
   */
  protected _playback: Map<Event['key'], any[][]> = new Map();

  /**
   * Emit an event, asynchronously.
   */
  emit = async (key: string, ...payload: any[]): Promise<any> => {
    const event = this._events.get(key);

    if (this.debug) { console.info(`emit\t${this.constructor.name}   ${key}`); }

    this.addPlayback(key, payload);

    if (!event) { return; }

    return event.propagate(...payload).catch(async (error) => {
      await this.emit('error', error);

      throw error;
    });
  }

  on = (key, callback: IOnCallback, options: IOnConfig = {}) => {
    const event = this._events.get(key) || new Event(key);

    if (this.debug) { console.info(`on\t${this.constructor.name}   ${key}`); }

    event.add({ ...options, callback });

    this._events.set(key, event);

    const playback = this._playback.get(key);

    if (playback) {
      playback.forEach((args) => event.propagate(...args));
    }
  }

  /**
   * Add listener to an event, but only fire the callback once.
   *
   * Also returns a promise which resolves only when the callback is executed.
   */
  once = (key, callback: IOnCallback, options: IOnceConfig = {}) => {
    return this.on(key, callback, { ...options, limit: 1 });
  }

  /**
   * Listen on any and all events
   */
  all () {
    return {
      on: ((callback, options?) => this.on('*', callback, options)),
    };
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

  private addPlayback (key: string, args: any[]) {
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
