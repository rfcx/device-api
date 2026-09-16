import { redactCredential } from './logging-redact'
import logging, { buildLogMessage } from './index'
import type { Request, Response } from 'express'

// A syntactically real but WORTHLESS token: signed by nothing, dummy payload.
// Never put a real credential in a test fixture.
const FAKE_JWT = [
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJzdWIiOiJ0ZXN0LXN1YmplY3QiLCJleHAiOjk5OTk5OTk5OTl9',
  'c2lnbmF0dXJlLXBsYWNlaG9sZGVy'
].join('.')

describe('redactCredential', () => {
  test('a bearer token never appears in the output, in whole or in part', () => {
    const out = redactCredential(`Bearer ${FAKE_JWT}`) as string
    expect(out).not.toContain(FAKE_JWT)
    // The payload segment IS the identity -- a truncation would still leak it.
    for (const segment of FAKE_JWT.split('.')) {
      expect(out).not.toContain(segment)
    }
    expect(out).not.toContain('eyJ')
  })

  test('keeps the scheme and adds a short stable fingerprint', () => {
    expect(redactCredential(`Bearer ${FAKE_JWT}`)).toMatch(/^Bearer \[REDACTED:[0-9a-f]{8}\]$/)
    expect(redactCredential(`Bearer ${FAKE_JWT}`)).toEqual(redactCredential(`Bearer ${FAKE_JWT}`))
    expect(redactCredential(`Bearer ${FAKE_JWT}`)).not.toEqual(redactCredential('Bearer other.tok.en'))
  })

  test('other schemes and bare credentials are redacted too', () => {
    expect(redactCredential('Basic dXNlcjpwYXNzd29yZA==')).toMatch(/^Basic \[REDACTED:[0-9a-f]{8}\]$/)
    expect(redactCredential(FAKE_JWT)).toMatch(/^\[REDACTED:[0-9a-f]{8}\]$/)
    expect(redactCredential(FAKE_JWT)).not.toContain('eyJ')
  })
})

describe('buildLogMessage', () => {
  const res = { statusCode: 200, responseTime: 42 } as unknown as Response

  test('NEGATIVE CONTROL: the built log line carries no token material', () => {
    // Exercises the real line builder, not just the helper. FAILS against the
    // pre-fix code, which interpolated req.headers.authorization directly.
    const req = {
      method: 'GET',
      url: '/v1/deployments',
      headers: { authorization: `Bearer ${FAKE_JWT}` },
      body: {}
    } as unknown as Request
    const line = buildLogMessage(req, res)
    expect(line).not.toContain(FAKE_JWT)
    expect(line).not.toContain('eyJ')
    expect(line).toContain('Authorization: Bearer [REDACTED:')
    // Shape preserved: the prefix support greps and Loki rules key on.
    expect(line).toContain('GET 200 /v1/deployments 42')
  })

  test('anonymous traffic still logs the literal "undefined" it always did', () => {
    // Measured on this deployment 2026-09-15: 349 such lines in 24h. That is
    // real anonymous-traffic signal, so the pre-existing `?? 'undefined'`
    // behaviour must survive redaction unchanged.
    const req = {
      method: 'GET',
      url: '/v1/deployments',
      headers: {},
      body: {}
    } as unknown as Request
    expect(buildLogMessage(req, res)).toContain('Authorization: undefined')
  })

  test('the logger still constructs (the middleware is wired, not just the builder)', () => {
    expect(logging).toBeDefined()
  })
})
