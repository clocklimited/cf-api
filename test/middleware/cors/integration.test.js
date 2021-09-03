var request = require('supertest')
  , assert = require('assert')
  , express = require('express')
  , createMiddleware = require('../../../middleware/cors')

describe('middleware/cors integration tests', function () {

  var app
    , allowed = [ 'http://127.0.0.1/' ]

  function checkOrigin(url, cb) {
    cb(null, allowed.indexOf(url) !== -1)
  }

  before(function () {
    app = express()
    app.use(createMiddleware(checkOrigin))
    app.all('/', function (req, res) {
      res.sendStatus(200)
    })
  })

  it('should pass through if no origin header exists', function (done) {
    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should send a 403 response to a request with an origin not in the allow list', function (done) {
    request(app)
      .put('/')
      .set('Origin', 'http://jim.com')
      .expect(403, done)
  })

  it('should set the correct response headers for a request with an origin in the allow list', function (done) {
    request(app)
      .post('/')
      .set('Origin', 'http://127.0.0.1/')
      .expect(200, done)
  })

  it('should send ‘content-length: 0’ for OPTION requests', function (done) {
    request(app)
      .options('/')
      .set('Origin', 'http://127.0.0.1/')
      .expect('Content-Length', '0')
      .expect(200)
      .end(done)
  })

  it('should not add expose header if options are not set', function (done) {
    request(app)
      .options('/')
      .set('Origin', 'http://127.0.0.1/')
      .expect(200)
      .end(function (error, req) {
        if (error) return done(error)
        assert.strictEqual(req.headers['Access-Control-Expose-Headers'], undefined)
        done()
      })
  })

  it('should add expose header if options set', function (done) {
    var appWithOptions = express()
    appWithOptions.use(createMiddleware(
      checkOrigin,
      {
        exposeHeaders: 'Filename'
      }
    ))
    appWithOptions.all('/', function (req, res) {
      res.sendStatus(200)
    })
    request(appWithOptions)
      .options('/')
      .set('Origin', 'http://127.0.0.1/')
      .expect('Access-Control-Expose-Headers', 'Filename')
      .expect(200)
      .end(done)
  })
})
