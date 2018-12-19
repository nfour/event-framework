# Changelog

Based on [Keep a Changelog](http://keepachangelog.com/).

## [Unreleased]

## [1.1.1-beta][] - 2018-12-19

- Republish with correct NPM ignore
- `HttpServer`
  - Routing params are now converted appropriately to koa-router syntax
    - `/foo/{bar}/baz` to `/foo/:bar/baz`

## [1.1.0-beta][] - 2018-12-19

- Bad publish

## [1.0.0-beta][] - 2018-12-19

- Refactor project to use the root directory as package root, and compilation to `build`

## [0.8.0-beta][] - 2018-12-19

- Misc

## [0.7.0-beta][] - 2018-12-04

- Rename env var for watching logs to `REACO_watchLogs

## [0.6.0-beta][] - 2018-12-04

- Fix watching behaviour looping endlessly
- Watching is now typescript aware

## [0.5.0-beta][] - 2018-12-04

- Various hot reloading tweaks

## [0.4.0-beta][] - 2018-12-03

- Added hot reloading to modules defined with `watch: true` in the module definition of ModuleProxy/Registry

## [0.3.0-beta][] - 2018-10-02

- Various changes

## [0.2.0-beta][] - 2018-04-08

- Added ability to launch `function-action-module` ModuleProxy components.

## [0.1.0-beta][] - 2018-03-28

- prototyping

## [0.0.2-6][] - 2018-01-06

- prototyping

## [0.0.2-5][] - 2018-01-06

- prototyping

## [0.0.2-4][] - 2018-01-06

- prototyping

## [0.0.2-3][] - 2018-01-06

- prototyping

## [0.0.2-2][] - 2018-01-06

- prototyping

## [0.0.2-1][] - 2018-01-06

- Init

[Unreleased]: https://github.com/nfour/reaco/compare/v1.1.1-beta...HEAD
[1.1.1-beta]: https://github.com/nfour/reaco/compare/v1.1.0-beta...v1.1.1-beta
[1.1.0-beta]: https://github.com/nfour/reaco/compare/v1.0.0-beta...v1.1.0-beta
[1.0.0-beta]: https://github.com/nfour/reaco/compare/v0.8.0-beta...v1.0.0-beta
[0.8.0-beta]: https://github.com/nfour/reaco/compare/v0.7.0-beta...v0.8.0-beta
[0.7.0-beta]: https://github.com/nfour/reaco/compare/v0.6.0-beta...v0.7.0-beta
[0.6.0-beta]: https://github.com/nfour/reaco/compare/v0.5.0-beta...v0.6.0-beta
[0.5.0-beta]: https://github.com/nfour/reaco/compare/v0.4.0-beta...v0.5.0-beta
[0.4.0-beta]: https://github.com/nfour/reaco/compare/v0.3.0-beta...v0.4.0-beta
[0.3.0-beta]: https://github.com/nfour/reaco/compare/v0.2.0-beta...v0.3.0-beta
[0.2.0-beta]: https://github.com/nfour/reaco/compare/v0.1.0-beta...v0.2.0-beta
[0.1.0-beta]: https://github.com/nfour/reaco/compare/v0.0.2-6...v0.1.0-beta
[0.0.2-6]: https://github.com/nfour/reaco/compare/v0.0.2-5...v0.0.2-6
[0.0.2-5]: https://github.com/nfour/reaco/compare/v0.0.2-4...v0.0.2-5
[0.0.2-4]: https://github.com/nfour/reaco/compare/v0.0.2-3...v0.0.2-4
[0.0.2-3]: https://github.com/nfour/reaco/compare/v0.0.2-2...v0.0.2-3
[0.0.2-2]: https://github.com/nfour/reaco/compare/v0.0.2-1...v0.0.2-2
[0.0.2-1]: https://github.com/nfour/reaco/tree/v0.0.2-1
