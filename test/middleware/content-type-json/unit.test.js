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

    var res = { json: mockJson, status: mockStatus }
      , i = 0

    function mockJson(err) {
      assert.equal(err.error, 'API only supports application/json content-type')
      if (++i === 3) done()
    }

    function mockStatus(code) {
      assert.equal(400, code)
      return this
    }

    middleware({ method: 'POST', headers: {} }, res, function () {
      assert(false, 'should not call next()')
    })
    middleware({ method: 'PUT', headers: {} }, res, function () {
      assert(false, 'should not call next()')
    })
    middleware({ method: 'PATCH', headers: {} }, res, function () {
      assert(false, 'should not call next()')
    })

  })

  it('should send a 406 response to a request with a "Content-Type" header that is not json', function (done) {

    var res = { status: mockStatus, json: mockJson }

    function mockJson(err) {
      assert.equal('API only supports application/json content-type', err.error)
      done()
    }

    function mockStatus(code) {
      assert.equal(400, code)
      return this
    }

    middleware({ method: 'POST', headers: { 'content-type': 'application/xml' } }, res, function () {
      assert(false, 'should not call next()')
    })

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
