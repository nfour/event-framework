[![CircleCI](https://circleci.com/gh/nfour/event-framework.svg?style=svg)](https://circleci.com/gh/nfour/event-framework)

# Untitled Event Framework

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Framework](#framework)
	* [Contibuting](#contibuting)
	* [About](#about)
	* [Concepts](#concepts)
		* [Implimentation](#implimentation)
		* [Components](#components)
	* [To Do](#to-do)

<!-- /code_chunk_output -->

----------

## Contibuting

To contribute to the project, please read: [CONTRIBUTING.md](./CONTRIBUTING.md)

## About

> Currently WIP

Run `yarn start src/_examples/<filename>` to test examples

## Concepts

### Implimentation

- Components
  - Components should abuse TypeScript so that when a component expects dependencies they will autocomplete events and validate at compile/design time
    - This helps ease one of the main problems developing within evented systems - knowing if the event is coming, and how to deal with it.
  - Components should not be concerned with dependency coupling or resolution, only relying on events of a certain signature to be fulfilled by something
    - `ComponentA` listening for event `http.request` should be satisfied by `HttpLambda` or `HttpServer` (or both) equally.

### Components
- Components should be able to exist in three realms:
  - in-process (node process)
  - inter-process (node child processes)
  - remote process (lambda, EC2, kubernetes)
- A component registry must exist which would allow locating of the above resources
  - Scenario:
      - `Developer A` works on `Component 2` which depends on `Component 1`, `Developer B` adds remote lambda resource for `Component 1`
      - `Developers A` can use the remote `Component 1` with live updates, improving team synergy


## To Do

- Action should take in middleware on instantiation via a bulk .connect or just the interfaces
- Middlewares should be components
- Errors & all event lifecycle conditions should be moved to HttpRequestEvent for soundness
  - This is only HttpRequestEvent due to the current Http feature focus, but it would actually
    be applied to any event component.
