var request = require('supertest')
  , assert = require('assert')
  , express = require('express')
  , middleware = require('../../../middleware/no-cache')

describe('middleware/no-cache integration tests', function () {

  var app

  before(function () {
    app = express()
    app.use(middleware)
    app.get('/', function (req, res) {
      res.status(200).end()
    })
  })

  it('should set the correct cache control headers', function (done) {

    request(app)
      .get('/')
      .end(function (err, res) {
        assert(!err)
        assert.equal('no-cache', res.headers.pragma)
        assert.equal('max-age=0,no-store,private', res.headers['cache-control'])
        assert.equal(0, res.headers.expires)
        assert.equal(200, res.statusCode)
        done()
      })

  })

})