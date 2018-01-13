# To Do

- [To Do](#to-do)
    - [Components](#components)
      - [Http Components](#http-components)
      - [Action](#action)
      - [Action Components](#action-components)
      - [(ISC) Inter-System-Communication](#isc-inter-system-communication)
        - [(IPC) Inter-process communcation](#ipc-inter-process-communcation)
        - [Http endpoint (1 way requester)](#http-endpoint-1-way-requester)
        - [Http endpoints (2 way requester and responder)](#http-endpoints-2-way-requester-and-responder)
        - [Socket connection (2 way socket connection)](#socket-connection-2-way-socket-connection)
    - [Testing](#testing)
        - [Performance](#performance)

### Components

- Merge `Component.Declared` and `Component.declare()`
  - We can use string literals as a type, thus it's not DRY currently


#### Http Components

- Fix response flow throughout existing examples
- Get error handling up to par with service-library

#### Action

- [x] ~~Ensure event & return information is passed to actions from connected components somehow~~

#### Action Components

- Create components
  - [ ] Json Api
  - [ ] Instrumentation
  - [ ] LambdaBatch
  - [ ] Lambda (Non HTTP)
  - [ ] ISCWrapper
  - [ ] IPCWrapper
  - [x] Http (Bundle)
  - [x] HttpLambda
  - [x] HttpServer

- Ensure an inter-middleware-component dependency can be resolved in a non-complex manner

#### (ISC) Inter-System-Communication

- [ ] Produce a schema for a component registry

##### (IPC) Inter-process communcation

May fall under ISC during implimentation

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

### Testing

##### Performance

- [ ] Ensure performance is decent
- [ ] Create a reproducable benchmark to detect regressions
