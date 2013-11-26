module.exports = badRequestMiddleware

function badRequestMiddleware(error, req, res, next) {
  if (error.name.match(/Bad Request/)) {
    return res.send(400, { error: 'content-type: ' + req.headers['content-type'] + ' does not match body' })
  }
  next(error)
}