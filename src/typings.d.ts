declare module 'decache';
declare module 'precinct' {
  const getDeps: (file: string) => string[];

  export = getDeps;
}
