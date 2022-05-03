import express from 'express'
import responseTime from 'response-time'
import bodyParser from 'body-parser'
import logger from './middleware/logger'
import tag from './middleware/tag'
import accepts from './middleware/accepts'
import contentType from './middleware/content-type'
import cors from './middleware/cors'
import errorHandler from './middleware/error'
import noCache from './middleware/no-cache'

function createServer(options) {
  const app = express()
  const contentTypes = options.contentTypes || ['application/json', 'text/csv']

  // Using Express behind a reverse proxy such as Varnish or Nginx is trivial,
  // however it does require configuration. By enabling the "trust proxy"
  // setting via app.enable('trust proxy'), Express will have knowledge that
  // it's sitting behind a proxy and that the X-Forwarded-* header fields may be
  // trusted, which otherwise may be easily spoofed.
  app.enable('trust proxy')

  // Attach middleware

  if (options.initialMiddleware) app.use(options.initialMiddleware)

  app

    // Wire up the express logger to the app logger
    .use(logger(options.logger))

    // X-Powered-By: Catfish
    .use(tag)

    // X-Response-time: Nms
    .use(responseTime())

    // Whitelist cross domain requests
    .use(cors(options.checkOrigin, options.corsOptions))

    // Body parse API for JSON content type
    .use(bodyParser.json({ limit: options.maxBodySize }))

    // Server only speaks JSON
    .use(accepts)
    .use(contentType(contentTypes))

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

export default createServer
