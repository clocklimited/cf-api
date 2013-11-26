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
      res.send(200)
    })
  })

  it('should set the correct cache control headers', function () {

    request(app)
      .get('/')
      .end(function (err, res) {
        assert(!err)
        assert.equal('no-cache', res.headers.pragma)
        assert.equal('no-cache', res.headers['cache-control'])
        assert.equal(200, res.statusCode)
      })

  })

})