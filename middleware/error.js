module.exports = createErrorMiddleware

var _ = require('lodash')

function createErrorMiddleware(logger) {
  /* jshint unused: false */
  return function errorHandler(error, req, res, next) {
    res.send(error.message, error.status || 500)
    logger.error('Error occurred while handling request:\n',
      _.pick(req, 'method', 'url', 'query', 'headers', 'ip', 'ips')
      , '\n' + error.message
      , '\n' + error.stack)

  }
}