# cf-api

A pluggable server for HTTP APIs.

This is CatfishApi but without all of the bloat and a simple API to register plugins.
Everything becomes a plugin.

## Installation

    npm install --save cf-api

## Usage

```js
var serviceLocator = require('service-locator').createServiceLocator()
  , api = require('cf-api')

// Register your services on the serviceLocator here…

api(serviceLocator)
  .plugin('/absolute/path/to/plugin')
  .initialize(function (err) {
    if (err) throw err
    createServerCluster(serviceLocator.app, serviceLocator.logger, properties)
  })
```

A plugin is just a node module that the api will require. It expects a single async
function to be exported.

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
