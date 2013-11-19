module.exports = tagMiddleware

function tagMiddleware(req, res, next) {
  res.set(
    { 'X-Powered-By': 'Catfish'
    })
  next()
}