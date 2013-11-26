var assert = require('assert')
  , middleware = require('../../../middleware/accepts')

describe('accepts middleware unit tests', function () {

  it('should send a 406 response to a request with no "Accept"', function (done) {
    function mockSend(statusCode) {
      assert.equal(statusCode, 406)
      done()
    }
    middleware({ headers: {} }, { send: mockSend })
  })

  it('should send a 406 response to a request without "application/json" in "Accept" header', function (done) {
    function mockSend(statusCode) {
      assert.equal(statusCode, 406)
      done()
    }
    middleware({ headers: { accept: 'jim,application/jsin,text/html,text/plain' } }, { send: mockSend })
  })

  it('should be ok with "application/json; q=0.8" in "Accept" header', function (done) {
    middleware({ headers: { accept: 'jim,application/json; q=0.8,text/html,text/plain' } }, {}, function () {
      done()
    })
  })

  it('should be ok with trailing/leading spaces in "Accept" header', function (done) {
    middleware({ headers: { accept: 'application/json , text/html ,text/plain,*/*' } }, {}, function () {
      done()
    })
  })

  it('should not be ok with "crapplication/json" in "Accept" header', function (done) {
    function mockSend(statusCode) {
      assert.equal(statusCode, 406)
      done()
    }
    middleware({ headers: { accept: 'crapplication/json , text/html ,text/plain,*/*' } }, { send: mockSend })
  })

})