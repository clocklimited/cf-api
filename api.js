module.exports = createApi

var createServer = require('./server')
  , componentLoader = require('component-loader')
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
 * API constructor. Instantiates an empty list of components.
 */
function Api(options) {
  this._components = []
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
 * Add one or many API components.
 */
Api.prototype.components = function (path) {
  if (!Array.isArray(path)) path = [ path ]
  this._components = this._components.concat(path)
  return this
}

// Alias component/components
Api.prototype.component = Api.prototype.components

/*
 * Create the server, initialize all of the components
 * and return the server.
 */
Api.prototype.initialize = function (serviceLocator, cb) {
  var server = createServer(this._options)
  componentLoader(this._components
  , function (loadComponentFn) {
      // if callback only has 2 params, assume it only wants serviceLocator (usually services)
      if (loadComponentFn.length === 2) {
        return loadComponentFn.bind(null, serviceLocator)
      } else {
        return loadComponentFn.bind(null, serviceLocator, server)
      }
    }
  , function (error) {
      cb(error, server)
    }
  )
}
