module.exports = {
  // "verbose": true,
  "transform": { ".ts": "ts-jest" },
  "testMatch": [ "**/*.(spec|test).(t|j)s?(x)" ],
  "testEnvironment": "node",
  "moduleFileExtensions": [ "ts", "js" ],
  "setupTestFrameworkScriptFile": "./src/test/jestFix.js",
  "coverageDirectory": ".coverage",
  "coverageReporters": ['text', 'text-summary', 'json', 'lcov'],
  "coverageThreshold": {
    "global": { statements: 60, lines: 60, functions: 60 }
  },
  // reporters: [ 'jest-tap-reporter' ],
  "testPathIgnorePatterns": [
    "staging",
    "/node_modules/",
    "/build/"
  ]
}
