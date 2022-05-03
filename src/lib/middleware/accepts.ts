import { RequestHandler } from 'express'

/*
 * Middleware to ensure the API only talks to
 * clients that accept JSON or binary as a response.
 */
const acceptMiddleware: RequestHandler = (req, res, next) => {
  // If no 'Accept: x' header assume anything is allowed
  if (!req.headers.accept) req.headers.accept = '*/*'

  // Get the list of acceptable response types
  let accepts = req.headers.accept.split(',')

  // This server only accepts JSON, so ditch any preference info, e.g
  // 'application/json; q=0.8' and trim leading/trailing whitespace
  accepts = accepts.map((type) => type.split(';')[0].trim())

  // If no existence of 'application/json' and 'application/octet-stream' in 'Accept: x' header then bye
  if (
    accepts.indexOf('application/json') === -1 &&
    accepts.indexOf('application/octet-stream') === -1 &&
    accepts.indexOf('application/*') === -1 &&
    accepts.indexOf('*/*') === -1
  ) {
    return res.sendStatus(406)
  }

  // Otherwise hello!
  return next()
}

export default acceptMiddleware
