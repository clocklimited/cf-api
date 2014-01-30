var assert = require('assert')
  , createMiddleware = require('../../../middleware/cors')

describe('middleware/cors unit tests', function () {

  it('should pass through if no origin header exists', function (done) {
    createMiddleware([])({ headers: {} }, {}, done)
  })

  it('should send a 403 response to a request with an origin not in the allow list', function (done) {

    function mockSend(statusCode) {
      assert.equal(403, statusCode)
      done()
    }

    createMiddleware([])({ headers: { origin: 'bar' } }, { send: mockSend }, function () {
      assert(false, 'should not call next()')
    })

  })

  it('should set the correct response headers for a request with an origin in the allow list', function (done) {

    var allowed = [ 'http://127.0.0.1/' ]

    function mockSet(headers) {
      assert.deepEqual(
        { 'Access-Control-Allow-Origin': '*'
        , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, *'
        , 'Access-Control-Request-Headers': '*'
        , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
        }, headers)
    }

    createMiddleware(allowed)({ headers: { origin: allowed[0] } }, { set: mockSet }, function () {
      done()
    })

  })

  it('should set cache headers on OPTIONS requests', function (done) {

    var allowed = [ 'http://127.0.0.1/' ]
      , count = 0

    function mockSet(header, value) {
      if (++count === 2) {
        assert.equal('Cache-Control', header)
        assert.equal('max-age=86400', value)
      }
    }

    function mockEnd() {
      done()
    }

    var req = { headers: { origin: allowed[0] }, method: 'OPTIONS' }
      , res = { set: mockSet, end: mockEnd }

    createMiddleware(allowed)(req, res, function () {
      assert(false, 'should not call next()')
    })

  })

})