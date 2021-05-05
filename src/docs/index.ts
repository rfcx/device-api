import type { Request, Response, NextFunction } from 'express'
import { SwaggerOptions, SwaggerUiOptions } from 'swagger-ui-express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { Router } from 'express'

const router = Router()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RFCx Ingest Service API Documentation',
      version: '0.0.1'
    },
    servers: [
      {
        url: 'https://staging-ingest.rfcx.org',
        description: 'Staging server'
      },
      {
        url: 'https://ingest.rfcx.org',
        description: 'Production server (live data - use with care)'
      },
      {
        url: 'http://localhost:3030',
        description: 'Local development'
      }
    ],
    components: {
      schemas: require('./modelSchemas.json'),
      requestBodies: require('./requestBodies.json'),
      securitySchemes: {
        auth0: {
          type: 'oauth2',
          description: 'This API uses OAuth 2 with the implicit grant flow.',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://auth.rfcx.org/authorize',
              tokenUrl: 'https://auth.rfcx.org/oauth/token',
              scopes: {
                openid: 'required',
                email: 'required',
                profile: 'required',
                offline: 'required'
              }
            }
          },
          'x-tokenName': 'id_token'
        }
      }
    },
    security: [
      {
        auth0: ['openid', 'email', 'profile', 'offline']
      }
    ]
  },
  apis: [
    './routes/*.js'
  ]
}

const swaggerSpec: swaggerUi.JsonObject = swaggerJSDoc(options)
const swaggerUiOptions: SwaggerOptions = {
  oauth2RedirectUrl: 'https://dev-ingest.rfcx.org/docs/auth-callback',
  operationsSorter: 'alpha'
}
const swaggerUiExpressOptions: SwaggerUiOptions = {
  customSiteTitle: 'RFCx Ingest Service API Documentation',
  customCss: '.topbar { display: none }',
  swaggerOptions: swaggerUiOptions
}

router.get('/auth-callback', (req: Request, res: Response) => res.sendFile('/docs/oauth-redirect.html', { root: '.' }))
router.use('/', swaggerUi.serve, (req: Request, res: Response) => {
  const host = req.get('host')
  const oauth2RedirectUrl = `${host?.endsWith('.rfcx.org') ? 'https' : 'http'}://${host}/docs/auth-callback`
  const options = { ...swaggerUiExpressOptions, swaggerOptions: { ...swaggerUiOptions, oauth2RedirectUrl } }
  swaggerUi.setup(swaggerSpec, options)(req, res)
})

module.exports = router
