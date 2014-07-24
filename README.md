# cf-api

A pluggable JSON API server

This is CatfishApi but without all of the bloat and a simple API to register components.
Everything becomes a component.

## Installation

    npm install --save cf-api

## Usage

```js
var serviceLocator = require('service-locator')()
  , api = require('cf-api')

// Register your services on the serviceLocator here…

api(options)
  .components([ require('./path/to/component'), require('./path/to/other/component') ])
  .initialize(serviceLocator, function (err, server) {
    if (err) throw err
    server.listen(1337)
  })
```

A component is just a node module which exports a function returning a component definition:

```js
module.exports = init

function init() {
  return { nameOfMyPlugin: [ 'nameOfMyDependency', function (serviceLocator, router, done) {
      // do plugin things...
      done()
  } ] }
}
```

## API API

### var api = createApi(Object: options)

Create an API instance. There are two options available:

- `checkOrigin` - a function with the signature `function (url, cb) {}` to check `req.headers.origin`. `cb(null, true)` to allow and `origin`, `cb(null, false)` to deny an origin. Defaults to `cb(null, true)` for all requests, meaning all cross-domain requests are allowed. It is up to the user to implement their whitelist/blacklist.
- `logger` - a logger object with methods `debug()`, `info()`, `warn()` and `error()` (default: `console`)

*For backwards compatibility, the `allowedDomains` option still works and generates a `checkOrigin` function for you.*

### api.components(Array: components) or api.component(Function: component)

Register a list of components (or a single component). These are not run when they are registered, but when `initialize()`
is called.

Returns `api` for chaining.

### api.initialize(Object: serviceLocator, Function: cb)

Create the server, initialize all of the components and callback with the server. Component initialize
functions are called with the following arguments: `component(serviceLocator, router)`.

Components are initialized according in the order necessicated by their defined dependencies.

`serviceLocator` is a place where your components can speak to application level services.
It could be a plain JS object, but it's better to use something like
[serby/service-locator](https://github.com/serby/service-locator) to prevent naming clashes.

`cb(err, server)` is called when all components have been initialized (`err=null`), or on the first
error (`err!=null`).

## Changelog

### 1.0.1
- Fixed cors middleware not terminating preflight requests. Do not use 1.0.0, please upgrade.

### 1.0.0
- Added `checkOrigin` option in place of `allowedDomains`. Latter is still supported for compatibility.

### Pre 1.0.0
- Unstable!

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
