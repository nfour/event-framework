export default {
  sources: [
    "src/**/*.ts",
    "!**/staging/**",
  ],
  cache: true,
  verbose: true,
  color: true,
  compileEnhancements: false,
  extensions: [ "ts" ],
  require: [ "ts-node/register" ]
};
