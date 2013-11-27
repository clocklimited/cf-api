module.exports = createApi

var async = require('async')
  , createServer = require('./server')
  , extend = require('lodash.assign')
  , defaults =
    { allowedDomains: []
    , logger: console
    }

/*
 * Create a new API instance
 */
function createApi(options) {
  return new Api(options)
}

/*
 * API constructor. Instantiates an empty list of plugins.
 */
function Api(options) {
  this._plugins = []
  this._options = extend({}, defaults, options)
}

/*
 * Add one or many API plugins.
 */
Api.prototype.plugins = function (path) {
  if (!Array.isArray(path)) path = [ path ]
  this._plugins = this._plugins.concat(path)
  return this
}

// Alias plugin/plugins
Api.prototype.plugin = Api.prototype.plugins

/*
 * Create the server, initialize all of the plugins
 * and callback with the server.
 */
Api.prototype.initialize = function (serviceLocator, cb) {
  var server = createServer(this._options)
  async.eachSeries(this._plugins, function (plugin, cb) {
    this._options.logger.info('Initializing plugin: ' + plugin)
    plugin(serviceLocator, server, cb)
  }.bind(this), function (err) {
    if (err) return cb(err)
    cb(null, server)
  })
}