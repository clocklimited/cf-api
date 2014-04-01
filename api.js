module.exports = createApi

var createServer = require('./server')
  , extend = require('lodash.assign')
  , defaults =
    { checkOrigin: function (domain, cb) {
        // Allow all domains by default
        cb(null, true)
      }
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

  // Support an array of allowedDomains for backwards compatibility
  if (Array.isArray(this._options.allowedDomains)) {
    this._options.checkOrigin = function (domain, cb) {
      if (this._options.allowedDomains.indexOf(domain) === -1) return cb(null, false)
      return cb(null, true)
    }.bind(this)
  }

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
 * and return the server.
 */
Api.prototype.initialize = function (serviceLocator, cb) {
  var server = createServer(this._options)
  try {
    this._plugins.forEach(function (plugin) {
      plugin(serviceLocator, server)
    })
    cb(null, server)
  } catch (e) {
    cb(e)
  }
}
