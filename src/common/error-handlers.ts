import type { Request, Response, NextFunction } from 'express'
import { ErrorWithRequest } from './types/error'

export function errorHandler (err: ErrorWithRequest, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err)
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized')
  } else {
    const status = err.response.data.error.status
    const message = err.response.data.message
    res.status(status).send(message)
  }
}

export function notFoundHandler (_req: Request, res: Response, next: NextFunction): void {
  res.status(404).send('Not found')
}
