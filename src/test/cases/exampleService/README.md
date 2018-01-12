
 # How it works:

 ## (HttpServer input)
 - hub emits a `start` event
 - httpServer listens on that, then starts its server up
 - http server has an endpoint routed to action `foo`
 - we send a fetch request to that endpoint
 - httpServer passes a HttpRequestEvent event to `foo`
 - middleware components catch it, turn it into an `execute` event (the only thing actions understand)
 - it executes
 - the result is used as a response to the incoming request in httpServer

 ## (HttpLambda input)
 - HttpLambda is instantiated with an Action, `foo`
 - HttpLambda.handler() returns a lambda handler that emits a `HttpRequestEvent` to `foo`
 - middlewares execute `foo` and respond
