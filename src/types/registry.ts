import componentMap from '../components/.map';

export type IComponentNames = keyof typeof componentMap;

export interface IComponentConfig {
  name?: string;
  component: IComponentNames;

  dependencies?: IComponentNames[];
}

export interface IIpcComponentConfig extends IComponentConfig {
  type: 'local' | 'remote';
  host: string;
  port: string;
}

export interface IComponentRegistryConfig {
  components: { [name: string]: IComponentConfig };
}
