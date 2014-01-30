module.exports = createCorsMiddleware

/*
 * Set cross-domain oriented headers, and check incoming
 * requests to ensure they come from allowed domains.
 */
function createCorsMiddleware(allowedDomains) {

  return function (req, res, next) {

    if (req.headers.origin) {

      // Request origin is not in list of allowed domains
      if (allowedDomains.indexOf(req.headers.origin) === -1) return res.send(403)

      // Request came from allowed domain so set acces control headers
      res.set(
        { 'Access-Control-Allow-Origin': '*'
        , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, *'
        , 'Access-Control-Request-Headers': '*'
        , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
        })

    }

    if (req.method === 'OPTIONS') {
      // Prefilght rarely changes so cache in proxies
      res.set('Cache-Control', 'max-age=86400')
      return res.end()
    }

    next()

  }
}
