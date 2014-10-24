module.exports = noCacheMiddleware

function noCacheMiddleware(req, res, next) {
  res.set(
    { 'Cache-Control': 'max-age=0,no-store,private'
    , 'Pragma': 'no-cache'
    , 'Expires': 0
    })
  next()
}