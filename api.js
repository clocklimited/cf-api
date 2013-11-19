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
  this._plugins.push(path)
  return this
}

Api.prototype.initialize = function (cb) {
  var server = createServer(this._serviceLocator)
  this._serviceLocator.app = server
  this._serviceLocator.router = server
  async.each(this._plugins, function (path, cb) {
    require(path)(this._serviceLocator, cb)
  }.bind(this), cb)
}