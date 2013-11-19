module.exports = createServer

var express = require('express')
  , logger = require('./middleware/logger')
  , tag = require('./middleware/tag')
  , cors = require('./middleware/cors')
  , badRequest = require('./middleware/bad-request')
  , accepts = require('./middleware/accepts')
  , contentType = require('./middleware/content-type')
  , cors = require('./middleware/cors')
  , errorHandler = require('./middleware/error')
  , noCache = require('./middleware/no-cache')

function createServer(serviceLocator) {

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
    .use(logger(serviceLocator.logger))

    // X-Powered-By: Catfish
    .use(tag)

    // X-Response-time: Nms
    .use(express.responseTime())

    // Whitelist cross domain requests
    .use(cors(serviceLocator.properties.allowedDomains))

    // Body parse API for JSON content type
    .use(express.json())

    // Server only speaks JSON
    .use(accepts)
    .use(contentType)

    // Handle content-type mismatch
    .use(badRequest)

    // Set headers to prevent caching
    .use(noCache)

    // Handle and log server error
    .use(errorHandler(serviceLocator.logger))

  return app

}