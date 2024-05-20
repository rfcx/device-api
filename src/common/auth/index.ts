import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import config from '../../config'

export const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  issuer: [`https://${config.AUTH0_DOMAIN}/`, `https://${config.AUTH0_CUSTOM_DOMAIN}/`],
  algorithms: ['RS256']
})
