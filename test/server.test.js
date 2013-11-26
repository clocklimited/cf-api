var request = require('supertest')
  , createServer = require('../server')

function noop() {}

describe('server', function () {

  var app

  before(function () {
    var noopLogger = { debug: noop, info: noop, warn: noop, error: noop }
    app = createServer({ logger: noopLogger, properties: { allowedDomains: [] } })
  })

  it('should start up and respond to a request', function (done) {

    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(404, done)

  })

})