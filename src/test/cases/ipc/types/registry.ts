export interface IComponentConfig {
  name: string;
  type: string;
}

export interface IComponentModuleConfig extends IComponentConfig {
  type: 'module';
  spawn?: boolean;
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
