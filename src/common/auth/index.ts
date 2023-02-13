import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import config from '../../config'
import { Auth0Token } from '../../types'
import axios from 'axios'

let token: Auth0Token

export const getToken = async function (): Promise<string> {
  if (token === undefined || !isTokenValid()) {
    await createToken()
  }
  return `Bearer ${token.access_token}`
}

export const isTokenValid = function (): boolean {
  // if token exists and won't expire in next 10 mins
  return token !== undefined && token.expires_at - (new Date()).valueOf() > 600000
}

export const createToken = async function (): Promise<Auth0Token> {
  const url = `https://${config.AUTH0_DOMAIN}/oauth/token`
  const headers = {
    'Content-Type': 'application/json'
  }
  const payload = {
    client_id: config.AUTH0_CLIENT_ID,
    client_secret: config.AUTH0_CLIENT_SECRET,
    audience: config.AUTH0_AUDIENCE,
    grant_type: config.AUTH0_GRANT_TYPE
  }
  console.log('\n\npayload', payload, '\n\n')
  return await axios.post(url, payload, { headers })
    .then((response: any) => {
      token = response.data
      token.expires_at = new Date().valueOf() + (token.expires_in * 1000)
      return token
    })
}

export const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  // audience: config.AUTH0_API_AUDIENCE TODO:// check if this property is really important and more secure,
  issuer: `https://${config.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
})
