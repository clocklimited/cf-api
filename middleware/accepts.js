module.exports = acceptsMiddleware

function acceptsMiddleware(req, res, next) {
  // If no headers accepts then bye
  if (!req.headers.accept) {
    return res.send(406)
  }
  var accepts = req.headers.accept.split(',')
  if (accepts.indexOf('application/json')) {
    return res.send(406)
  }
  next()
}