import winston from 'winston'
import expressWinston from 'express-winston'
import type { Request, Response } from 'express'

const logging = expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.simple()
  ),
  meta: false,
  msg: (req: Request, res: Response) => {
    return `${req.method} ${res.statusCode} ${req.url} ${res.responseTime} Authorization: ${req.headers.authorization ?? 'undefined'} ${JSON.stringify(req.body)}`
  },
  expressFormat: false,
  statusLevels: true
})

export default logging
