var request = require('supertest')
  , express = require('express')
  , middleware = require('../../../middleware/content-type-json')

describe('middleware/content-type-json integration tests', function () {

  var app

  before(function () {
    app = express()
    app.use(middleware)
    app.all('/', function (req, res) {
      res.send(200)
    })
  })

  it('should delegate to the route handler for a GET request', function (done) {
    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should delegate to the route handler for a HEAD request', function (done) {
    request(app)
      .head('/')
      .expect(200, done)
  })

  it('should delegate to the route handler for any non-POST/PUT/PATCH request', function (done) {
    request(app)
      .unlock('/')
      .expect(200, done)
  })

  it('should send a 400 response to a request without json in the "Content-Type" header', function (done) {
    request(app)
      .post('/')
      .set('Content-Type', 'text/plain')
      .expect(400, done)
  })

  it('should send a 200 response to a request with json in the "Content-Type" header', function (done) {
    request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect(200, done)
  })

  it('should be ok with "application/json; charset=utf8" in the "Content-Type" header', function (done) {
    request(app)
      .post('/')
      .set('Content-Type', 'application/json; charset=utf8')
      .expect(200, done)
  })

})