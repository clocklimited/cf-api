module.exports = createErrorMiddleware

var pick = require('lodash.pick')

/*
 * Create a error handling middleware (one that gets called if
 * some route handler does next(err)). This logs the error and responds
 * to the client.
 */
function createErrorMiddleware(logger) {

  /* jshint unused: false */
  return function errorHandler(error, req, res, next) {
    res.status(error.status || 500).json({ error: error.message })
    logger.error('Error occurred while handling request:\n',
      pick(req, 'method', 'url', 'query', 'headers', 'ip', 'ips')
      , '\n' + error.message
      , '\n' + error.stack)
  }

}
