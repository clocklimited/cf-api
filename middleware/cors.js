module.exports = createCorsMiddleware

/*
 * Set cross-domain oriented headers, and check incoming
 * requests to ensure they come from allowed domains.
 */
function createCorsMiddleware(checkOrigin, options) {
  options = options || {}

  return function (req, res, next) {

    if (req.headers.origin) {

      // Check if this client should be served
      checkOrigin(req.headers.origin, function (err, allowed) {
        if (err) return next(err)

        if (!allowed) return res.sendStatus(403)

        // Request came from allowed domain so set access control headers
        var headers =
          { 'Access-Control-Allow-Origin': req.headers.origin
          , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, x-cf-ttl, *'
          , 'Access-Control-Request-Headers': '*'
          , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
          }
          if (options.exposeHeaders) {
            headers['Access-Control-Expose-Headers'] = options.exposeHeaders
          }

        res.set(headers)

        // Don't call next() if this is a preflight CORS check
        if (req.method === 'OPTIONS') {
          res.set('Content-Length', 0)
          return res.end()
        }

        next()

      })

    } else {
      next()
    }

  }
}
