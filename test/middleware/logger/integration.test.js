var request = require('supertest')
  , assert = require('assert')
  , express = require('express')
  , createMiddleware = require('../../../middleware/logger')

describe('middleware/logger integration tests', function () {

  var app
    , logger = {}

  before(function () {
    app = express()
    app.use(createMiddleware(logger))
    app.get('/', function (req, res) {
      res.sendStatus(200)
    })
  })

  it('should call logger.info(msg) when a request comes in', function (done) {

    var logged = false

    logger.info = function (msg) {
      assert(msg)
      logged = true
    }

    request(app)
      .get('/')
      .expect(200, function (err) {
        setTimeout(function () {
          assert(logged)
          done(err)
        })
      })

  })

})
