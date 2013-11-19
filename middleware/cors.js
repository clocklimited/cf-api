module.exports = createCorsMiddleware

function createCorsMiddleware(allowedDomains) {

  return function (req, res, next) {
    if (req.headers.origin) {
      if (allowedDomains.indexOf(req.headers.origin) !== -1) {
        res.set(
          { 'Access-Control-Allow-Origin': req.headers.origin
          , 'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-cf-date, *'
          , 'Access-Control-Request-Headers': '*'
          , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH'
          })
      } else {
        return res.send(403)
      }
    }
    if (req.method === 'OPTIONS') {
      // Prefilght rarely changes so cache in proxies
      res.set('Cache-Control', 'max-age=86400')
      return res.end()
    }
    next()
  }
}
