var request = require('supertest')
  , assert = require('assert')
  , express = require('express')
  , createMiddleware = require('../../../middleware/error')

describe('middleware/error integration tests', function () {

  var app
    , logger = {}

  before(function () {
    app = express()

    app.get('/', function (req, res, next) {
      next(new Error('Test error'))
    })

    app.get('/status', function (req, res, next) {
      var error = new Error('Test error')
      error.status = 503
      next(error)
    })

    app.use(createMiddleware(logger))
  })

  it('should call logger.err(msg) when next(err) is called', function (done) {

    var logged = false

    logger.error = function (msg) {
      assert.equal('Error occurred while handling request:\n', msg)
      logged = true
    }

    request(app)
      .get('/')
      .expect(500, function (err) {
        setTimeout(function () {
          assert(logged)
          done(err)
        })
      })

  })

  it('should use error.status if it exists', function (done) {

    var logged = false

    logger.error = function (msg) {
      assert.equal('Error occurred while handling request:\n', msg)
      logged = true
    }

    request(app)
      .get('/status')
      .expect(503, function (err) {
        setTimeout(function () {
          assert(logged)
          done(err)
        })
      })
  })

  it('should respond with json', function (done) {

    logger.error = function () {}

    request(app)
      .get('/status')
      .expect(503, function (err, res) {
        if (err) done(err)
        assert.deepEqual({ error: 'Test error' }, res.body)
        done()
      })

  })

})
