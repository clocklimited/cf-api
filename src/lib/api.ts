import createServer from './server'

export type OriginCheckerCallback = (
  error: null | Error,
  allowed: boolean
) => void

export type OriginChecker = (
  domain: string,
  callback: OriginCheckerCallback
) => void

export interface CorsOptions {
  exposeHeaders?: string
}

export interface CfApiOptions {
  allowedDomains?: string[]
  checkOrigin?: OriginChecker
  logger?: typeof console
  maxBodySize?: string
  initialMiddleware?: null | (() => void)
  corsOptions?: CorsOptions
  contentTypes?: string[]
}

const defaults: CfApiOptions = {
  logger: console,
  maxBodySize: '100kb',
  contentTypes: ['application/json', 'text/csv']
}

/*
 * Create a new API instance
 */
function createApi(options: CfApiOptions) {
  return new Api(options)
}

class Api {
  readonly options: CfApiOptions

  constructor(options: CfApiOptions) {
    this.options = { ...defaults, ...options }
  }

  /**
   * Create and return the server.
   */
  initialize() {
    return createServer(this.options, this.checkOrigin)
  }

  /**
   * Checks if a specified domain is allowed to access the API
   */
  checkOrigin(domain: string, callback: OriginCheckerCallback) {
    // Support an array of allowedDomains for backwards compatibility
    if (Array.isArray(this.options.allowedDomains)) {
      if (this.options.allowedDomains.indexOf(domain) === -1) {
        return callback(null, false)
      }
      return callback(null, true)
    } else if (typeof this.options.checkOrigin === 'function') {
      return this.options.checkOrigin(domain, callback)
    } else {
      // Allow all domains by default
      return callback(null, true)
    }
  }
}

export default createApi
