var assert = require('assert')
  , api = require('../')
  , noopLogger = { debug: noop, info: noop, warn: noop, error: noop }

function noop() {}

describe('api', function () {

  describe('createApi()', function () {

    it('should be a function', function () {
      assert.equal('function', typeof api)
    })

    it('should create an object that has a _plugins array', function () {
      assert(Array.isArray(api()._plugins))
    })

  })

  describe('plugins()', function () {

    it('should populate and add to the plugins array', function () {

      function noop() {}

      var myApi = api()
        .plugins([ noop, noop, noop ])

      assert.equal(3, myApi._plugins.length)

      myApi.plugins([ noop, noop ])

      assert.equal(5, myApi._plugins.length)

      myApi.plugins(noop)
      assert.equal(6, myApi._plugins.length)

    })

  })

  describe('initialize()', function () {

    it('should run all of the functions added with .plugins() in series', function (done) {

      var initialized = 0

      function plugin(n) {
        return function (serviceLocator, router, cb) {
          assert.equal(n, ++initialized)
          cb(null)
        }
      }

      api()
        .plugins([ plugin(1), plugin(2), plugin(3) ])
        .initialize({ properties: { allowedDomains: [] }, logger: noopLogger }, function (err) {
          assert(!err)
          assert.equal(3, initialized)
          done()
        })

    })

    it('should stop on the first error', function (done) {

      function run(serviceLocator, router, cb) {
        cb(new Error('Startup error'))
      }

      function notRun() {
        assert(false, 'this plugin function should not be called')
      }

      api()
        .plugins([ run, notRun, notRun ])
        .initialize({ properties: { allowedDomains: [] }, logger: noopLogger }, function (err) {
          assert(err)
          assert.equal('Startup error', err.message)
          done()
        })

    })

  })

})