var assert = require('assert')
  , middleware = require('../../../middleware/accepts')

function noop() {}

describe('middleware/accepts unit tests', function () {

  it('should send a 406 response to a request with no "Accept"', function (done) {
    function mockStatus(statusCode) {
      assert.equal(406, statusCode)
      done()
      return { end: noop }
    }
    middleware({ headers: {} }, { status: mockStatus })
  })

  it('should send a 406 response to a request without json in "Accept" header', function (done) {
    function mockStatus(statusCode) {
      assert.equal(406, statusCode)
      done()
      return { end: noop }
    }
    var headers = { accept: 'jim,application/jsin,text/html,text/plain' }
    middleware({ headers: headers }, { status: mockStatus }, function () {
      assert(false, 'should not call next()')
    })
  })

  it('should be ok with "application/json; q=0.8" in "Accept" header', function (done) {
    middleware({ headers: { accept: 'jim,application/json; q=0.8,text/html,text/plain' } }, {}, function () {
      done()
    })
  })

  it('should be ok with "application/application/octet-stream; q=0.8" in "Accept" header', function (done) {
    middleware({ headers:
      { accept: 'jim,application/octet-stream; q=0.8,text/html,text/plain' } }, {}, function () {
      done()
    })
  })

  it('should be ok with trailing/leading spaces in "Accept" header', function (done) {
    middleware({ headers: { accept: 'application/json , text/html ,text/plain' } }, {}, function () {
      done()
    })
  })

  it('should correct negotiate partial wildcards in "Accept" header', function (done) {
    middleware({ headers: { accept: 'application/*' } }, {}, function () {
      done()
    })
  })

  it('should correct negotiate fill wildcard in "Accept" header', function (done) {
    middleware(
      { headers:
        { accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' }
      }, {}, function () {
        done()
      })
  })

  it('should not be ok with "crapplication/json" in "Accept" header', function (done) {
    function mockStatus(statusCode) {
      assert.equal(406, statusCode)
      done()
      return { end: noop }
    }
    var accept = 'crapplication/json , text/html'
    middleware({ headers: { accept: accept } }, { status: mockStatus }, function () {
      assert(false, 'should not call next()')
    })
  })

})
