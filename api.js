module.exports = createApi

var async = require('async')
  , createServer = require('./server')

function createApi(serviceLocator) {
  return new Api(serviceLocator)
}

function Api(serviceLocator) {
  this._serviceLocator = serviceLocator
  this._plugins = []
}

Api.prototype.plugin = function (path) {
  if (!Array.isArray(path)) path = [ path ]
  this._plugins = this._plugins.concat(path)
  return this
}

Api.prototype.initialize = function (cb) {
  var server = createServer(this._serviceLocator)
  this._serviceLocator.app = server
  this._serviceLocator.router = server
  async.eachSeries(this._plugins, function (path, cb) {
    this._serviceLocator.logger.info('Initializing plugin: ' + path)
    require(path)(this._serviceLocator, cb)
  }.bind(this), cb)
}