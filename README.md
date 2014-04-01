# cf-api

A pluggable JSON API server

This is CatfishApi but without all of the bloat and a simple API to register plugins.
Everything becomes a plugin.

## Installation

    npm install --save cf-api

## Usage

```js
var serviceLocator = require('service-locator').createServiceLocator()
  , api = require('cf-api')

// Register your services on the serviceLocator here…

api(options)
  .plugins([ require('./path/to/plugin'), require('./path/to/other/plugin') ])
  .initialize(serviceLocator, function (err, server) {
    if (err) throw err
    server.listen(1337)
  })
```

A plugin is just a node module with a single synchronous function exported:

```js
module.exports = init

function init(serviceLocator, router) {
  // Do plugin things…
}
```

## API API

### var api = createApi(Object: options)

Create an API instance. There are two options available:

- `checkOrigin` - a `function (origin, cb) {}` to check cross origin requests. `cb(null, true)` to allow and `origin`, `cb(null, false)` to deny an origin. Defaults to `cb(null, true)` for all requests, meaning all cross-domain requests are allowed. It is up to the user to implement their whitelist/blacklist. *For backwards compatibility, the `allowedDomains` option still works and generates a `checkOrigin` function for you.*
- `logger` - a logger object with methods `debug()`, `info()`, `warn()` and `error()` (default: `console`)

### api.plugins(Array: plugins) or api.plugin(Function: plugin)

Register a list of plugins (or a single plugin). These are not run when they are registered, but when `initialize()`
is called.

Returns `api` for chaining.

### api.initialize(Object: serviceLocator, Function: cb)

Create the server, initialize all of the plugins and callback with the server. Plugin initialize
functions are called with the following arguments: `plugin(serviceLocator, router)`.

Plugins are initialized in the order that they were passed to `plugin()`.

`serviceLocator` is a place where your plugins can speak to application level services.
It could be a plain JS object, but it's better to use something like
[serby/service-locator](https://github.com/serby/service-locator) to prevent naming clashes.

`cb(err, server)` is called when all plugins have been initialized (`err=null`), or on the first
error (`err!=null`).

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
