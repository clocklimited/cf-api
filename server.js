module.exports = createServer

var express = require('express')
  , logger = require('./middleware/logger')
  , tag = require('./middleware/tag')
  , cors = require('./middleware/cors')
  , accepts = require('./middleware/accepts')
  , contentType = require('./middleware/content-type')
  , cors = require('./middleware/cors')
  , errorHandler = require('./middleware/error')
  , noCache = require('./middleware/no-cache')
  , responseTime = require('response-time')
  , bodyParser = require('body-parser')

function createServer(options) {

  var app = express()

  // Using Express behind a reverse proxy such as Varnish or Nginx is trivial,
  // however it does require configuration. By enabling the "trust proxy"
  // setting via app.enable('trust proxy'), Express will have knowledge that
  // it's sitting behind a proxy and that the X-Forwarded-* header fields may be
  // trusted, which otherwise may be easily spoofed.
  app.enable('trust proxy')

  // Attach middleware

  app

    // Wire up the express logger to the app logger
    .use(logger(options.logger))

    // X-Powered-By: Catfish
    .use(tag)

    // X-Response-time: Nms
    .use(responseTime())

    // Whitelist cross domain requests
    .use(cors(options.checkOrigin))

    // Body parse API for JSON content type
    .use(bodyParser.json({ limit: options.maxBodySize }))

    // Server only speaks JSON
    .use(accepts)
    .use(contentType([ 'application/json', 'text/csv' ]))

    // Set headers to prevent caching
    .use(noCache)

  // Allow routes to be added before the error handler.
  // When routes have finished being added `.emit('preBoot')`
  app.on('preBoot', function () {
    // Handle and log server error
    app.use(errorHandler(options.logger))
  })

  return app

}
