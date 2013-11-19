module.exports = parseQueryString

var _ = require('lodash')

function parseQueryString(req, res, next) {
  try {
    req.query.filter = parseQueryStringObject(req.query.filter, {})
    req.query.sort = parseSortOptions(req.query.sort)
    req.query.pagination = parseQueryStringObject(req.query.pagination,
      { page: 1
      , pageSize: 50
      })
    req.query.keywords = parseQueryStringObject(req.query.keywords, [])
  } catch (e) {
    return res.json(e.message, 400)
  }
  next()
}

function parseQueryStringObject(parameter, defaultValue) {

  var result

  if (parameter) {
    result = JSON.parse(parameter)
    if (typeof result !== 'object') {
      throw new Error('Invalid parameter provided')
    }
  }

  if (Array.isArray(defaultValue)) {
    if (!Array.isArray(result)) return defaultValue
    return result
  } else {
    return _.extend({}, defaultValue, result)
  }

}

function parseSortOptions(parameter) {
  var rawOptions = parseQueryStringObject(parameter)
    , sort = 'asc'

  if (!rawOptions) return null

  if (typeof rawOptions[1] !== 'undefined') {
    sort = rawOptions[1]
  }

  return [ [ rawOptions[0], sort ] ]
}