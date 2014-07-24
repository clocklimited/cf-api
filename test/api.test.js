var assert = require('assert')
  , api = require('../')
  , noopLogger = { debug: noop, info: noop, warn: noop, error: noop }

function noop() {}

describe('api', function () {

  describe('createApi()', function () {

    it('should be a function', function () {
      assert.equal('function', typeof api)
    })

    it('should create an object that has a _components array', function () {
      assert(Array.isArray(api()._components))
    })

  })

  describe('cors', function () {

    it('should allow all domains by default', function (done) {
      var app = api()
      app._options.checkOrigin('anything goes!', function (err, allowed) {
        assert(allowed)
        done()
      })
    })

    it('should maintain backwards compatibility for allowedDomains option', function (done) {

      var app = api({ allowedDomains: [ 'a.com', 'b.com', 'c.com' ] })
        , todo = 2

      function finished() {
        if (--todo === 0) done()
      }

      app._options.checkOrigin('a.com', function (err, allowed) {
        assert(allowed)
        finished()
      })

      app._options.checkOrigin('a.net', function (err, allowed) {
        assert(!allowed)
        finished()
      })

    })

  })

  describe('components()', function () {

    it('should populate and add to the components array', function () {

      function noop() {}

      var myApi = api()
        .components([ noop, noop, noop ])

      assert.equal(3, myApi._components.length)

      myApi.components([ noop, noop ])

      assert.equal(5, myApi._components.length)

      myApi.components(noop)
      assert.equal(6, myApi._components.length)

    })

  })

  describe('initialize()', function () {

    it('should run all of the functions added with .components() in series', function (done) {

      var initialized = 0

      function component(n) {
        return function () {
          var definition = {}
          definition[component + n] = function (sl, s, cb) {
            assert.equal(n, ++initialized)
            cb()
          }
          return definition
        }
      }

      function diffComponent() {
        return { diffComponent: function (s, cb) {
          cb()
        } }
      }

      api()
        .components([ component(1), component(2), component(3), diffComponent ])
        .initialize({ properties: { allowedDomains: [] }, logger: noopLogger }, function (err) {
          assert(!err)
          assert.equal(3, initialized)
          done()
        })

    })

    it('should stop on the first error', function (done) {

      function run() {
        return {
          run: function (sl, s, cb) {
            cb(new Error('Startup error'))
          }
        }
      }

      function notRun(id) {
        var definition = {}
        definition['notRun' + id] = [ 'run', function (sl, s, cb) {
          assert(false, 'this component function should not be called')
          cb()
        }]
        return definition
      }

      api()
        .components([ run, notRun.bind(null, 1), notRun.bind(null, 2) ])
        .initialize({ properties: { allowedDomains: [] }, logger: noopLogger }, function (err) {
          assert(err)
          assert.equal('Startup error', err.message)
          done()
        })

    })

  })

})
