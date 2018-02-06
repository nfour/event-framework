import { ChildProcess, fork } from 'child_process';
import { Component } from '../../../..';
import { deferredPromise, IDefferedPromise } from '../../../lib';
import { IComponentModuleConfig } from '../types/registry';
import { ProxyComponent } from './ProxyComponent';

export class ModuleProxy extends ProxyComponent {
  type: 'module';
  private config: IComponentModuleConfig;
  private component: IDefferedPromise<Component<any>>;

  constructor (config: IComponentModuleConfig) {
    super(config);

    this.config = config;

    this.component = deferredPromise();
  }

  async initialize () {
    const { path, member = 'default' } = this.config.module;

    if (this.config.spawn) {
      // Process spawn component

      // TODO: need to make a spawner file which takes path/member as args
      const child = fork('./spawn.ts', [path, member, this.name, this.type], { cwd: __dirname });

      this.component.resolve(new ProcessComponent(child));
    } else {
      // Local component

      const module: Component<any> = await import(path);

      this.component.resolve(module[member]);
    }
  }

  on = async (...args: any[]) => {
    const component = await this.component;

    component.on(...args);
  }

  emit = async (...args: any[]) => {
    const component = await this.component;

    return component.emit(...args);
  }
}

export interface IProcessComponentMessage {
  eventName: string;
  payload: any[];
}

export class ProcessComponent extends Component<any> { // FIXME: any
  private child: ChildProcess;

  constructor (child: ChildProcess) {
    super();

    this.child = child;

    this.child.on('message', (msg?: IProcessComponentMessage) => {
      if (!msg || !(msg instanceof Object)) { return; }

      const { eventName, payload } = msg;

      return this.emit.call(this, eventName, ...payload);
    });
  }

  emit = (...args) => {
    // TODO: impliment async await here
    (this.child.emit as any)(...args);
  }
}
