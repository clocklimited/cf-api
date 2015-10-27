module.exports = createMiddleware

var morgan = require('morgan')

/*
 * Wires up the built in express request logger
 * to the serviceLocator logger
 */
function createMiddleware(logger) {
  return morgan('short', { stream: { write: function (data) { logger.info((data + '').trim()) } } })
}
