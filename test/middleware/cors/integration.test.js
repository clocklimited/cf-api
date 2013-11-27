var request = require('supertest')
  , assert = require('assert')
  , express = require('express')
  , createMiddleware = require('../../../middleware/cors')

describe('middleware/cors integration tests', function () {

  var app

  before(function () {
    app = express()
    app.use(createMiddleware([ 'http://127.0.0.1/' ]))
    app.all('/', function (req, res) {
      res.send(200)
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

  it('should set cache headers on OPTIONS requests', function (done) {
    request(app)
      .options('/')
      .set('Origin', 'http://127.0.0.1/')
      .expect(200, function (err, res) {
        if (err) return done(err)
        assert.equal('max-age=86400', res.header['cache-control'])
        done()
      })
  })

})