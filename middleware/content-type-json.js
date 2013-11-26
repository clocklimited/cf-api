module.exports = contentTypeMiddleware

/*
 * Middleware to ensure the API only handles request
 * payloads when the content type is declared to be JSON.
 */
function contentTypeMiddleware(req, res, next) {
  if ([ 'POST', 'PUT', 'PATCH' ].indexOf(req.method) === -1) return next()
  if (isJson(req.headers['content-type'])) return next()
  res.json({ error: 'API only supports application/json content-type' }, 400)
}

/*
 * Check if the body of a header indicates that the request body is JSON
 */
function isJson(contentTypeHeader) {
  if (!contentTypeHeader) return false
  // This header is allowed two components: type and charset, eg:
  //   'Content-Type: application/json; charset=utf-8'
  // This check is only concerning the type component so
  // split on the ';' and trim any whitespace before comparing.
  var contentType = contentTypeHeader.split(';')[0].trim()
  return contentType === 'application/json'
}