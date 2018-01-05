import { Event, IListenerConfig } from './Event';

export interface IOnConfig { priority?: IListenerConfig['priority']; limit?: IListenerConfig['limit']; }
export interface IOnceConfig { priority?: IListenerConfig['priority']; }

/**
 * A component acts as both a subscriber and an event emitter.
 */
export abstract class Emitter {
  private _events: { [key: string]: Event } = {};

  /**
   * Emit an event, asynchronously.
   */
  emit = async (key: string, ...payload: any[]): Promise<any> => {
    const event = this._events[key];

    if (!event) { return; }

    return event.propagate(...payload).catch(async (error) => {
      await this.emit('error', error);

      throw error;
    });
  }

  on = (key, callback, options: IOnConfig = {}): Event => {
    const event = this._events[key] || new Event(key);

    event.add({ ...options, callback });

    this._events[key] = event;

    return event;
  }

  /**
   * Add listener to an event, but only fire the callback once.
   *
   * Also returns a promise which resolves only when the callback is executed.
   */
  once = (key, callback, options: IOnceConfig = {}) => {
    const on = this.on as any;

    return on(key, callback, { ...options, limit: 1 });
  }

  priority (priority: number) {
    return {
      on: <any> ((key, callback, options = {}) => (<any> this.on)(key, callback, { ...options, priority })),
    };
  }

  /** Remove a listener which matches `callback` */
  off = (key: string, callback) => {
    const event = this._events[key];

    if (!event) { return false; }

    const listener = event.get(callback);

    if (!listener) { return false; }

    event.remove(listener);

    return true;
  }
}
