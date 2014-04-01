module.exports = createCorsMiddleware

/*
 * Set cross-domain oriented headers, and check incoming
 * requests to ensure they come from allowed domains.
 */
function createCorsMiddleware(checkDomain) {

  return function (req, res, next) {

    if (req.headers.origin) {

      // Check if this client should be served
      checkDomain(req.headers.origin, function (err, allowed) {

        if (!allowed) return res.send(403)

        // Request came from allowed domain so set acces control headers
        res.set(
          { 'Access-Control-Allow-Origin': req.headers.origin
          , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, *'
          , 'Access-Control-Request-Headers': '*'
          , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
          })

        next()

      })

    } else {
      next()
    }

  }
}
