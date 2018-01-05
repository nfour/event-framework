import { Event, IEventContext, IListenerConfig } from './Event';

export type IOnCallback = (...args: any[]) => void;

export interface IComponent {
  Emit: {
    (name: 'error', error: Error);
  };

  On: IOn<{ name: 'error', event: Error }>;

  Declared: 'error';
  Subscribed;
}

export interface IOnGeneric {
  name: string;
  event?: any;
  return?: any;
}

export type IOn<G extends IOnGeneric> = (
  name: G['name'],
  callback: (this: IEventContext, event: G['event']) => G['return'],
) => Event;

export interface IComponentSignaturesGeneric {
  Emit: (name: string, callback: any) => any;
  On: (name: string, callback: any) => any;
  Declared;
  Subscribed;
}

export type IMiddlewareInterface<C extends Component> = (component: C) => void;

export interface IOnConfig { priority?: IListenerConfig['priority']; limit?: IListenerConfig['limit']; }
export interface IOnceConfig { priority?: IListenerConfig['priority']; }

/**
 * A component acts as both a subscriber and an event emitter.
 */
export class Component<
  E extends IComponentSignaturesGeneric = IComponent,
  S extends IComponentSignaturesGeneric = IComponent
> implements IComponent {
  //
  // Input types
  //

  /** Input call signatures for emitters */
  Emit: any;

  /** Input call signatures for listeners */
  On: any;

  /** Declared event names by this component */
  Declared: S['Declared'];

  /** List of subscribed event names */
  Subscribed: S['Subscribed'];

  //
  // Generated types
  //

  /** Merged call signatures for all emitters */
  _AllEmit: S['Emit'] & E['Emit'] & IComponent['Emit'];

  /** Merged call signatures for all listeners */
  _AllOn: IComponent['On'] & E['On'] & S['On'];

  /** Merged list of event name that can be subscribed to */
  _Subscribable: IComponent['Declared'] | E['Declared'];

  components: Set<Component> = new Set();
  declarations: Set<this['Declared']> = new Set();
  subscriptions: Set<this['Subscribed']> = new Set();

  /**
   * Declare that this component will emit an event.
   * When a component is connected via .connect(), the delcarations are listened to.
   */
  declare (eventName: this['Declared']) {
    this.declarations.add(eventName);
  }

  /**
   * Subscribe to an event
   */
  subscribe (eventName: this['_Subscribable']) {
    this.subscriptions.add(eventName);
  }

  /**
   * Relays an event from the **input** component to **this** component.
   */
  relay<C extends Component> (component: C, eventName: C['Declared']) {
    component.on(<any> eventName, (...args: any[]) => (<any> this.emit)(eventName, ...args));
  }

  /**
   * Calls the provided function with this component.
   * A convenience function.
   *
   * // TODO: if instantiating a component meant passing in middleware interfaces
   * // this could then check if they match, thus forcing component middlewares
   * // to be consistantly declared and allowing full control over action execution interfaces
   */
  use (middleware: IMiddlewareInterface<Component<any, this>>) {
    middleware(this);

    return this;
  }

  /**
   * Connects this component to another component by:
   * - Relaying events from the input component's **declared** events to this component.
   * - Relaying events from this component matching the **subscribed** events on the input component.
   */
  connect<C extends Component<any, any>> (component: C) {
    this.components.add(component);

    component.declarations.forEach((eventName: Component['Declared']) => {
      this.relay(component, <any> eventName);
    });

    component.subscriptions.forEach((eventName: Component['Subscribed']) => {
      component.relay(this, <any> eventName);
    });
  }

  disconnect (component: Component) {
    this.components.delete(component);

  }

  //
  // Events
  //

  // tslint:disable-next-line:member-ordering
  private _events: { [key: string]: Event } = {};

  /**
   * Emit an event, asynchronously.
   */
  emit: this['_AllEmit'] = async (key, ...payload): Promise<any> => {
    const event = this._events[key];

    if (!event) { return; }

    return event.propagate(...payload).catch(async (error) => {
      await this.emit('error', error);

      throw error;
    });
  }

  on: this['_AllOn'] = (key, callback, options: IOnConfig = {}): Event => {
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
  once: this['_AllOn'] = (key, callback, options: IOnceConfig = {}) => {
    const on = this.on as any;

    return on(key, callback, { ...options, limit: 1 });
  }

  priority<A extends this = this> (priority: number) {
    return {
      on: <A['_AllOn']> ((key, callback, options = {}) => (<any> this.on)(key, callback, { ...options, priority })),
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
