module.exports = createApi

var createServer = require('./server')
  , extend = require('lodash.assign')
  , defaults =
    { checkOrigin: function (domain, cb) {
        // Allow all domains by default
        cb(null, true)
      }
    , logger: console
    , maxBodySize: '100kb'
    }

/*
 * Create a new API instance
 */
function createApi(options) {
  return new Api(options)
}

/*
 * API constructor.
 */
function Api(options) {
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
 * Create and return the server.
 */
Api.prototype.initialize = function () {
  return createServer(this._options)
}
