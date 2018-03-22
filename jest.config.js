module.exports = {
  "verbose": true,
  "transform": {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testMatch": [
    "**/*.(spec|test).(t|j)s?(x)"
  ],
  "testEnvironment": "node",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "setupTestFrameworkScriptFile": "./src/test/jestFix.js",
  "coverageDirectory": ".coverage",
  "coverageReporters": ['text', 'text-summary', 'json', 'lcov'],
  "coverageThreshold": {
    "global": { statements: 76, lines: 80, functions: 72 }
  },
  reporters: [ 'jest-tap-reporter' ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/build/"
  ]
}
