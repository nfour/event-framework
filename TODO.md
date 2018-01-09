# To Do


<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

- [To Do](#to-do)
        - [Components](#components)
            - [Action](#action)
            - [Action Components](#action-components)
            - [Inter-System-Communication (ISC) Components](#inter-system-communication-isc-components)
                - [Inter-process communcation](#inter-process-communcation)
                - [Http endpoint (1 way requester)](#http-endpoint-1-way-requester)
                - [Http endpoints (2 way requester and responder)](#http-endpoints-2-way-requester-and-responder)
                - [Socket connection (2 way socket connection)](#socket-connection-2-way-socket-connection)

<!-- /code_chunk_output -->

### Components

- Merge `Component.Declared` and `Component.declare()`
  - We can use string literals as a type, thus it's not DRY currently

#### Action

- Ensure event & return information is passed to actions from connected components somehow

#### Action Components

- Create more useful components
  - [ ] Json Api
  - [ ] Instrumentation
  - [x] Http
  - [ ] LambdaBatch
  - [ ] Lambda (Non HTTP)

- Ensure an inter-middleware-component dependency can be resolved in a non-complex manner

#### Inter-System-Communication (ISC) Components

- [ ] Produce a schema for a component registry

##### Inter-process communcation

- [ ] A component should be able to exist in another process
- [ ] This component should leverage `process.send()` and `process.on()` for message sending
- [ ] Cluser module should be considered
- [ ] Atomics should be considered
- [ ] Event payloads must be serializable

##### Http endpoint (1 way requester)

- [ ] Interface with `HttpRequest`
- [ ] Can send requests to the endpoint and recieve a response
- [ ] Cannot recieve requests

##### Http endpoints (2 way requester and responder)
- [ ] Interface with `HttpRequest`
- [ ] Can send requests to the endpoint and recieve a response
- [ ] Can recieve requests by setting up its own endpoint via `HttpServer`

##### Socket connection (2 way socket connection)
- [ ] Acts directly as a regular inter-process component, just over remote sockets
