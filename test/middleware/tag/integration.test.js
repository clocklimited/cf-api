var request = require('supertest')
  , assert = require('assert')
  , express = require('express')
  , middleware = require('../../../middleware/tag')

describe('middleware/tag integration tests', function () {

  var app

  before(function () {
    app = express()
    app.use(middleware)
    app.get('/', function (req, res) {
      res.sendStatus(200)
    })
  })

  it('should set the correct header', function (done) {

    request(app)
      .get('/')
      .end(function (err, res) {
        assert(!err)
        assert.equal(res.headers['x-powered-by'], 'Catfish')
        assert.equal(200, res.statusCode)
        done()
      })

  })

})
