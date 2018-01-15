export interface IComponentConfig {
  name: string;
  connection: 'ipc' | 'local';
}

export interface IIpcComponentConfig extends IComponentConfig {
  type: 'ipc';
  host: string;
  port: string;
}

export interface IEngineConfig {
  components: { [name: string]: IComponentConfig|IIpcComponentConfig };
}
