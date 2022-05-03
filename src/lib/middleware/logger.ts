import morgan from 'morgan'

import { CfApiOptions } from '../api'

/*
 * Wires up the built in express request logger
 * to the serviceLocator logger
 */
const createMiddleware = (logger: CfApiOptions['logger']) => {
  return morgan('short', {
    stream: {
      write(data: unknown) {
        logger.info(String(data).trim())
      },
    },
  })
}

export default createMiddleware
