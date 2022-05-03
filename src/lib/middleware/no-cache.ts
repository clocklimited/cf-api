import { RequestHandler } from 'express'

const noCacheMiddleware: RequestHandler = (req, res, next) => {
  res.set({
    'Cache-Control': 'max-age=0,no-store,private',
    Pragma: 'no-cache',
    Expires: 0,
  })
  next()
}

export default noCacheMiddleware
