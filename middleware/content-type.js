module.exports = contentTypeMiddleware

// Only allow application/json content-type requests
function contentTypeMiddleware(req, res, next) {
  if ((['POST', 'PUT'].indexOf(req.method) !== -1)
    && (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') === -1)) {
    return res.json({ error: 'API only supports application/json content-type' }, 400)
  }
  next()
}