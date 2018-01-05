
export interface IEventContext {
  key: string;
  propagation: boolean;
  previousValue: any;
  stopPropagation (): void;
}

export type IEventCallback = (this: IEventContext, ...payload: any[]) => any;

export interface IListener {
  callback: IEventCallback;
  stack?: Error['stack'];
  limit: number;
  hits: number;
  priority: number;
}

export interface IListenerConfig {
  callback: IEventCallback;
  stack?: Error['stack'];
  limit?: number;
  priority?: number;
}

export class Event {
  public key: string;
  public listeners: IListener[] = [];

  constructor (key: string) {
    this.key = key;
  }

  /**
   * Executes callbacks in sequence
   *
   * @returns Last callback's result
   */
  public async propagate (...payload: any[]) {
    const context: IEventContext = {
      key: this.key,
      propagation: true,
      stopPropagation () { context.propagation = false; },
      previousValue: undefined,
    };

    let result;
    const removed = new WeakSet();

    for (const listener of this.listeners) {
      if (context.propagation === false) { break; }
      if (removed.has(listener)) { continue; }

      listener.hits += 1;

      const { callback, limit, hits } = listener;

      if (hits >= limit) {
        this.remove(listener);
        removed.add(listener);
      }

      result = await Promise.resolve(callback.apply(context, payload));

      context.previousValue = result;
    }

    return result;
  }

  public remove (listener: IListener) {
    const index = this.listeners.indexOf(listener);

    if (index > -1) { this.listeners.splice(index, 1); }

    this.sort();
  }

  public get (callback: IEventCallback) {
    return this.listeners.find((listener: IListener) => listener.callback === callback);
  }

  public add (input: IListenerConfig): IListener {
    const listener = <IListener> {
      ...input,
      hits: 0,
      limit: input.limit || Infinity,
      priority: input.priority || 0,
    };

    this.listeners.push(listener);

    this.sort();

    return listener;
  }

  private sort () {
    this.listeners = this.listeners.sort(({ priority: a = -1 }, { priority: b = -1 }) => {
      return b === Infinity || a >= b ? -1 : 1;
    });
  }
}
