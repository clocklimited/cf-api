# cf-api

A pluggable JSON API server

This is CatfishApi but without all of the bloat and a simple API to register plugins.
Everything becomes a plugin.

## Installation

    npm install --save cf-api

## Usage

```js
var createApi = require('cf-api')

var api = createApi(options)
  server = api.initialize()

server.get('/', homepage)
server.post('/form', submit)

// This tells the api that you've finised adding your routes
// and you now want it to add the error handling middleware
server.emit('preBoot')

server.listen(port)
```

## API API

### var api = createApi(Object: options)

Create an API instance. There are two options available:

- `checkOrigin` - a function with the signature `function (url, cb) {}` to check `req.headers.origin`. `cb(null, true)` to allow and `origin`, `cb(null, false)` to deny an origin. Defaults to `cb(null, true)` for all requests, meaning all cross-domain requests are allowed. It is up to the user to implement their whitelist/blacklist.
- `logger` - a logger object with methods `debug()`, `info()`, `warn()` and `error()` (default: `console`).
- `maxBodySize` - an option to be passed along to the [body-parser json middleware](https://github.com/expressjs/body-parser#limit) function. If this is a number it will be the number of bytes, otherwise it will be parsed by the [bytes module](https://github.com/visionmedia/bytes.js) (default: `undefined` which falls back to the body parser default of `'100kB'`).

*For backwards compatibility, the `allowedDomains` option still works and generates a `checkOrigin` function for you.*

### api.initialize()

Create and return the server.

## Changelog

### 2.0.0
- Plugin interface now totally removed. Application components are registered outside of the scope of this module.
- User must call `server.emit('preBoot')` after all routes have been added to make tell the api to add the last piece of middleware: the error handler. This is due to a change in Express 4.

### 1.1.0
- API now allows binary request bodies as well as json

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
