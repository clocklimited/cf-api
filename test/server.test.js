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

  it('should 413 when maxBodySize is set to 1b', function(done){
    var buf = new Buffer(2)
      , app = createServer({ maxBodySize: '1b', logger: noopLogger, properties: { allowedDomains: [] } })

    buf.fill('.')

    request(app)
    .post('/')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Content-Length', '12')
    .send(JSON.stringify({ str: buf.toString() }))
    .expect(413, done)
  })

  it('should 200 when maxBodySize is set to 100b', function(done){
    var buf = new Buffer(2)
      , app = createServer({ maxBodySize: '100b', logger: noopLogger, properties: { allowedDomains: [] } })

    app.post('/test', function (req, res) { res.end() })

    buf.fill('.')

    request(app)
    .post('/test')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Content-Length', '12')
    .send(JSON.stringify({ str: buf.toString() }))
    .expect(200, done)
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
