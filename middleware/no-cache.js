module.exports = noCacheMiddleware

function noCacheMiddleware(req, res, next) {
  res.set(
    { 'Pragma': 'no-cache'
    , 'Cache-Control': 'no-cache'
    })
  next()
}