export interface IComponentConfig {
  name: string;
  type: string;
}

export interface IComponentModuleConfig extends IComponentConfig {
  type: 'module';
  /** When set, this module may be forked as a child process */
  fork?: boolean;

  /** The module path details */
  module: {
    path: string;
    member?: string;
  };
}

export interface IComponentHttpConfig extends IComponentConfig {
  type: 'http';
  url: string;
}

export type IComponentConfigs = (
  IComponentModuleConfig |
  IComponentHttpConfig
);

export type IRegistryConfig = IComponentConfigs[];
