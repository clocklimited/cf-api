var assert = require('assert')
  , createMiddleware = require('../../../middleware/cors')
  , extend = require('lodash.assign')

describe('middleware/cors unit tests', function () {

  it('should pass through if no origin header exists', function (done) {
    createMiddleware(function () {
      assert(false, 'checkOrigin() should not be called when req.headers.origin does not exist')
    })({ headers: {} }, {}, done)
  })

  it('should call next() with error when checkOrigin returns an error', function (done) {

    var msg = 'Error from check origin'

    function checkOrigin(url, cb) {
      cb(new Error(msg))
    }

    createMiddleware(checkOrigin)({ headers: { origin: 'bar' } }, {}, function (err) {
      assert.equal(err.message, msg)
      done()
    })

  })

  it('should send a 403 response when checkOrigin calls back with false', function (done) {

    function mockSend(statusCode) {
      assert.equal(403, statusCode)
      done()
    }

    function checkOrigin(url, cb) {
      cb(null, false)
    }

    createMiddleware(checkOrigin)({ headers: { origin: 'bar' } }, { send: mockSend }, function () {
      assert(false, 'should not call next()')
    })

  })

  it('should set the correct response headers for a request with an origin in the allow list', function (done) {

    var allowed = [ 'http://127.0.0.1/' ]

    function checkOrigin(url, cb) {
      cb(null, allowed.indexOf(url) !== -1)
    }

    function mockSet(headers) {
      assert.deepEqual(
        { 'Access-Control-Allow-Origin': 'http://127.0.0.1/'
        , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, *'
        , 'Access-Control-Request-Headers': '*'
        , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
        }, headers)
    }

    createMiddleware(checkOrigin)({ headers: { origin: allowed[0] } }, { set: mockSet }, function () {
      done()
    })

  })

  it('should not call next() if req.method is OPTIONS', function (done) {

    var allowed = [ 'http://127.0.0.1/' ]

    function checkOrigin(url, cb) {
      cb(null, allowed.indexOf(url) !== -1)
    }

    function mockEnd() {
      done()
    }

    createMiddleware(checkOrigin)(
        { headers: { origin: allowed[0] }
        , method: 'OPTIONS'
        }
      , { end: mockEnd, set: function () {} }, function () {
          assert(false, 'next() should not have been called')
        })
  })

  it('should OPTIONS set ‘content-length: 0’ for OPTIONS method', function (done) {

    var headers = {}
      , allowed = [ 'http://127.0.0.1/' ]

    function checkOrigin(url, cb) {
      cb(null, true)
    }

    function mockEnd() {
      assert.equal(headers['Content-Length'], 0)
      done()
    }

    createMiddleware(checkOrigin)(
        { headers: { origin: allowed[0] }
        , method: 'OPTIONS'
        }
      , { end: mockEnd
        , set: function(key, value) {
            if (typeof key === 'object') {
              extend(headers, key)
            } else {
              headers[key] = value
            }
          }
        })
  })

})
