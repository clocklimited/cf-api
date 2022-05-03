import createServer from './server'

export interface ApiOptions {
  allowedDomains?: string[]
  checkOrigin?: (domain: string, callback) => void
  logger?: typeof console
  maxBodySize?: string
  corsOptions?: { exposeHeaders?: string }
}

const defaults = {
  checkOrigin: function (domain, cb) {
    // Allow all domains by default
    cb(null, true)
  },
  logger: console,
  maxBodySize: '100kb',
  initialMiddleware: null,
  corsOptions: { exposeHeaders: '' },
}

/*
 * Create a new API instance
 */
function createApi(options: ApiOptions) {
  return new Api(options)
}

class Api {
  readonly options: ApiOptions

  constructor(options: ApiOptions) {
    this.options = { ...defaults, ...options }

    // Support an array of allowedDomains for backwards compatibility
    if (Array.isArray(this.options.allowedDomains)) {
      this.options.checkOrigin = function (domain, cb) {
        if (this.options.allowedDomains.indexOf(domain) === -1) {
          return cb(null, false)
        }
        return cb(null, true)
      }.bind(this)
    }
  }

  /*
   * Create and return the server.
   */
  initialize() {
    return createServer(this.options)
  }
}

export default createApi
