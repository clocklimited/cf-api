import { ErrorRequestHandler } from 'express'
import pick from 'lodash.pick'

import { CfApiOptions } from '../api'

/*
 * Create a error handling middleware (one that gets called if
 * some route handler does next(err)). This logs the error and responds
 * to the client.
 */
const createErrorMiddleware = (logger: CfApiOptions['logger']) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const middleware: ErrorRequestHandler = (error, req, res, next) => {
    res.status(error.status || 500).json({ error: error.message })
    if (logger) {
      logger.error(
        'Error occurred while handling request:\n',
        pick(req, 'method', 'url', 'query', 'headers', 'ip', 'ips'),
        '\n' + error.message,
        '\n' + error.stack
      )
    }
  }

  return middleware
}

export default createErrorMiddleware
