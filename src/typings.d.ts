declare module 'decache';
declare module 'precinct' {
  type ITypes = 'commonjs' | 'css' | 'amd' | 'es6' | 'sass' | 'less' | 'scss' | 'stylus' | 'ts';
  const getDeps: (
    content: string,
    options?: ITypes | { type: ITypes, es6?: { mixedImports?: boolean } },
  ) => string[];

  export = getDeps;
}

// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
  // tslint:disable-next-line:interface-name
  interface ProcessEnv {
    DEBUG_WATCHING: string;
  }
}
