var assert = require('assert')
  , middleware = require('../../../middleware/content-type-json')

describe('middleware/content-type-json unit tests', function () {

  it('should pass through on non PUT/POST/PATCH requests', function (done) {

    var i = 0
    function mockNext() {
      if (++i === 4) done()
    }

    middleware({ method: 'GET' }, {}, function () {
      mockNext()
    })

    middleware({ method: 'DELETE' }, {}, function () {
      mockNext()
    })

    middleware({ method: 'HEAD' }, {}, function () {
      mockNext()
    })

    middleware({ method: 'FLUMP' }, {}, function () {
      mockNext()
    })

  })


  it('should send a 406 response to a request without a "Content-Type" header', function (done) {

    var i = 0
    function mockJson(err, statusCode) {
      assert.equal(400, statusCode)
      assert.equal(err.error, 'API only supports application/json content-type')
      if (++i === 3) done()
    }

    middleware({ method: 'POST', headers: {} }, { json: mockJson })
    middleware({ method: 'PUT', headers: {} }, { json: mockJson })
    middleware({ method: 'PATCH', headers: {} }, { json: mockJson })

  })

  it('should send a 406 response to a request with a "Content-Type" header that is not json', function (done) {

    function mockJson(err, statusCode) {
      assert.equal(400, statusCode)
      assert.equal(err.error, 'API only supports application/json content-type')
      done()
    }

    middleware({ method: 'POST', headers: { 'content-type': 'application/xml' } }, { json: mockJson })

  })

  it('should pass through on a request with a "Content-Type" header that is json', function (done) {
    middleware({ method: 'POST', headers: { 'content-type': 'application/json' } }, {}, function () {
      done()
    })
  })

  it('should be ok with the charset parameter in the "Content-Type" header', function (done) {
    middleware({ method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' } }, {}, function () {
      done()
    })
  })

  it('should be ok with the arbitrary parameters in the "Content-Type" header', function (done) {
    middleware({ method: 'POST', headers: { 'content-type': 'application/json; foo=bar' } }, {}, function () {
      done()
    })
  })

})