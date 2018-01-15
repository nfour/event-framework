import { IComponentConfig, IEngineConfig } from '../../../types/registry';

export class Engine {
  components: Map<string, EngineComponent> = new Map();

  constructor (
    public config: IEngineConfig,
  ) {
    this.config = config;

    Object.keys(config.components).forEach((key) => {
      this.add(config.components[key]);
    });
  }

  add (config: IComponentConfig) {
    const component = new EngineComponent(config);

    this.components.set(component.name, component);
  }

  get (key: string) {
    return this.components.get(key);
  }

  /**
   * Resolves all component's listeners
   */
  start () {
  }
}

class EngineComponent implements IComponentConfig {
  connection: IComponentConfig['connection'];
  name: IComponentConfig['name'];

  constructor (config: IComponentConfig) {
    Object.assign(this, config);
  }
}
