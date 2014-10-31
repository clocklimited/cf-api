var request = require('supertest')
  , express = require('express')
  , middleware = require('../../../middleware/accepts')

describe('middleware/accepts integration tests', function () {

  var app

  before(function () {
    app = express()
    app.use(middleware)
    app.get('/', function (req, res) {
      res.send(200)
    })
  })

  it('should send a 406 response to a request with no "Accept"', function (done) {
    request(app)
      .get('/')
      .expect(406, done)
  })

  it('should send a 406 response to a request without json in the "Accept" header', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'text/html,text/plain,*/*')
      .expect(406, done)
  })

  it('should delegate to the route handler if json exists in the "Accept" header', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200, done)
  })

  it('should be ok if json is not the first mime type in the "Accept" header', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'text/plain,application/json')
      .expect(200, done)
  })

  it('should be ok if json is not the preferred mime type in the "Accept" header', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'text/plain; q=0.8,application/json; q=0.5')
      .expect(200, done)
  })

  it('should delegate to the route handler if application/octet-stream exists in the "Accept" header', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/octet-stream')
      .expect(200, done)
  })

})
