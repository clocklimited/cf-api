module.exports = createMiddleware

const morgan = require('morgan');

/*
 * Wires up the built in express request logger
 * to the serviceLocator logger
 */
function createMiddleware(logger) {

  return morgan({ format: 'short'
  , stream:
    { write: function (data) {
        logger.info((data + '').trim())
      }
    }
  })

}