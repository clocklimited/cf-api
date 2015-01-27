module.exports = contentTypeMiddleware

function contentTypeMiddleware(types) {

  /*
  * Middleware to ensure the API only handles request
  * payloads when the content type is declared to be valid.
  */
  function middleware(req, res, next) {
    if ([ 'POST', 'PUT', 'PATCH' ].indexOf(req.method) === -1) return next()
    if (isValidType(req.headers['content-type'])) return next()
    if (!req.headers['content-type']) return res.status(400).json({ error: 'API requires a content-type' })
    res.status(400).json({ error: 'API does not support ' + req.headers['content-type'] + ' content-type' })
  }

  /*
  * Check if the body of a header indicates that the request body of a type
  * that we have deemed valid
  */
  function isValidType(contentTypeHeader) {
    if (!contentTypeHeader) return false

    // This header is allowed two components: type and charset, eg:
    //   'Content-Type: application/json; charset=utf-8'
    // This check is only concerning the type component so
    // split on the ';' and trim any whitespace before comparing.
    var contentType = contentTypeHeader.split(';')[0].trim()

    return types.indexOf(contentType) !== -1
  }

  return middleware

}
