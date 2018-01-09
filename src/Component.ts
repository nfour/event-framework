import { Emitter } from './Emitter';
import { Event, IEventContext, IListenerConfig } from './Event';

export type IOnCallback = (this: IEventContext, ...args: any[]) => void;

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
> extends Emitter implements IComponent {
  //
  // Input types
  //

  /** Input call signatures for emitters */
  Emit;

  /** Input call signatures for listeners */
  On;

  /** Declared event names by this component */
  Declared: S['Declared'];

  /** List of subscribed event names */
  Subscribed: IComponent['Subscribed'] | S['Subscribed'];

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

  emit: this['_AllEmit'];
  on: this['_AllOn'];
  once: this['_AllOn'];

  /**
   * Declare that this component will emit an event.
   * When a component is connected via .connect(), the delcarations are listened to.
   */
  declare (...eventNames: Array<this['Declared']>) {
    eventNames.forEach((name) => {
      this.declarations.add(name);
    });
  }

  /**
   * Subscribe to an event
   */
  subscribe (...eventNames: Array<this['_Subscribable']>) {
    eventNames.forEach((name) => {
      this.subscriptions.add(name);
    });
  }

  /**
   * Relays an event from the **input** component to **this** component.
   */
  relay<C extends Component<any, any>> (component: C, eventName: C['Declared']) {
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
  use (middleware: IMiddlewareInterface<Component<any, any>>) {
    middleware(this);

    return this;
  }

  /**
   * Connects this component to another component by:
   * - Relaying events from the input component's **declared** events to this component.
   * - Relaying events from this component matching the **subscribed** events on the input component.
   */
  connect (...components: Array<Component<any, any>>) {
    for (const component of components) {
      this.components.add(component);

      component.declarations.forEach((eventName) => {
        this.relay(component, <any> eventName);
      });

      component.subscriptions.forEach((eventName) => {
        component.relay(this, <any> eventName);
      });
    }
  }

  connectOn (name: string, getComponents: () => Array<Component<any, any>>) {
    this.on(name, (event) => {
      console.log('connectOn\t', name);
      event.connect(...getComponents());

      return event;
    });
  }

  disconnect (component: Component<any, any>) {
    this.components.delete(component);
  }
}
