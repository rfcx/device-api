import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import config from '../../config'

const baseJWT = {
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  issuer: `https://${config.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
}

export const jwtCheck = (): jwt.RequestHandler => {
  baseJWT.issuer = `https://${config.AUTH0_DOMAIN}/`
  return jwt(baseJWT)
}

export const jwtCustomCheck = (): jwt.RequestHandler => {
  baseJWT.issuer = `https://${config.AUTH0_CUSTOM_DOMAIN}/`
  return jwt(baseJWT)
}
