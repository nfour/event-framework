import { ModuleProxy } from '../components/Ipc';

export interface IComponentConfig {
  name: string;
  type: IComponentConfigs['type'];
}

// TODO: this must be used by external components to decorate pubsub
export interface IComponentExternalConfig {
  component: {
    subscriptions: string[];
    declarations: string[];
  };
}

export interface IComponentModuleConfig extends IComponentConfig {
  type: ModuleProxy['type'];
  /** When set, this module may be forked as a child process */
  fork?: boolean;

  /** The module path details */
  module: {
    path: string;
    member?: string;
  };
}

export type IComponentExternalModuleConfig = IComponentModuleConfig & IComponentExternalConfig & {
  fork: true;
};

export interface IComponentHttpConfig extends IComponentConfig {
  type: 'http';
  url: string;
}

export type IComponentConfigs = (
  IComponentModuleConfig |
  IComponentExternalModuleConfig |
  IComponentHttpConfig
);

export type IRegistryConfig = IComponentConfigs[];
