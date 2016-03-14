var request = require('supertest')
  , createServer = require('../server')
  , noopLogger = { debug: noop, info: noop, warn: noop, error: noop }
  , assert = require('assert')

function noop() {}

describe('server', function () {

  it('should start up and respond to a request', function (done) {

    var app = createServer({ logger: noopLogger, properties: { allowedDomains: [] } })
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(404, done)

  })

  it('shouldn’t add error middleware until "preBoot" event is emitted', function (done) {
      var app = createServer({ logger: noopLogger, properties: { allowedDomains: [] } })
      app.use(function (req, res, next) { next(new Error('hi from test')) })
      request(app)
        .get('/dshkdsfhk')
        .set('Accept', 'application/json')
        .expect(500)
        .end(function (err, res) {
          if (err) return done(err)
          app.emit('preBoot')
          assert(/Error: hi from test/.test(res.text))
          request(app)
            .get('/dshkdsfhk')
            .set('Accept', 'application/json')
            .expect(500)
            .end(function (err, res) {
              if (err) return done(err)
              assert.deepEqual(res.body, { error: 'hi from test' })
            })
          done()
        })
  })

})
