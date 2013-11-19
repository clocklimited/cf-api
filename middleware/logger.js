module.exports = createMiddleware

var express = require('express')

function createMiddleware(logger) {

  return express.logger(
    { format: 'default'
    , stream:
      { write: function (data) {
          logger.info((data + '').trim())
        }
      }
    })

}