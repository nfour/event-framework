declare module 'decache';
declare module 'precinct' {
  const getDeps: (file: string) => string[];

  export = getDeps;
}

// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
  // tslint:disable-next-line:interface-name
  interface ProcessEnv {
    DEBUG_WATCHING: string;
  }
}
