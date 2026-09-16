import winston from 'winston'
import expressWinston from 'express-winston'
import type { Request, Response } from 'express'
import { redactCredential } from './logging-redact'

/**
 * Build the request-log line.
 *
 * Exported so it can be unit-tested directly: express-winston does not expose
 * the `msg` function it is handed, so a test that goes through the logger
 * object cannot assert on the line this produces (OPEN-ITEMS §271).
 */
export const buildLogMessage = (req: Request, res: Response): string => {
  // OPEN-ITEMS §271: NEVER interpolate the raw Authorization header -- it is a
  // live user credential (see ./logging-redact.ts). Measured on this very
  // deployment 2026-09-15: 142 token-bearing lines in 24h, 18 distinct
  // identities, 141/142 still valid at read time. The line SHAPE is unchanged
  // so existing support greps and Loki rules keep matching -- including the
  // 'undefined' case, which is real anonymous-traffic signal (349 such lines
  // in the same 24h window).
  const auth = redactCredential(req.headers.authorization) ?? 'undefined'
  return `${req.method} ${res.statusCode} ${req.url} ${res.responseTime} Authorization: ${auth} ${JSON.stringify(req.body)}`
}

const logging = expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.simple()
  ),
  meta: false,
  msg: buildLogMessage,
  expressFormat: false,
  statusLevels: true
})

export default logging
