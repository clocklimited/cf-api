var assert = require('assert')
  , api = require('../')

describe('api', function () {

  describe('createApi()', function () {

    it('should be a function', function () {
      assert.equal('function', typeof api)
    })

  })

  describe('initialize()', function () {
    it('should return a server', function () {
      assert.equal(typeof api().initialize(), 'function')
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

})
