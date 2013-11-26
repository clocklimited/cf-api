module.exports = createMiddleware

var express = require('express')

/*
 * Wires up the built in express request logger
 * to the serviceLocator logger
 */
function createMiddleware(logger) {

  return express.logger(
    { format: 'short'
    , stream:
      { write: function (data) {
          logger.info((data + '').trim())
        }
      }
    })

}