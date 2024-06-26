import type { Request, Response, NextFunction } from 'express'
import { ErrorWithResponse } from './types/error'

export function errorHandler (err: ErrorWithResponse, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err)
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized')
  } else if ('response' in err) {
    const status = err.response.data.error.status
    const message = err.response.data.message
    res.status(status).send(message)
  } else {
    console.error('Unexpected error', err)
    res.sendStatus(500)
  }
}

export function notFoundHandler (_req: Request, res: Response, next: NextFunction): void {
  res.status(404).send('Not found')
}
