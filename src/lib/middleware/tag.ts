import { RequestHandler } from 'express'

const tagMiddleware: RequestHandler = (req, res, next) => {
  res.set({ 'X-Powered-By': 'Catfish' })
  next()
}

export default tagMiddleware
