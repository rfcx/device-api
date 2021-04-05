import express from 'express'
import cors from 'cors'
import assets from './assets/router'
import deployments from './deployments/router'
import streams from './streams/router'
import projects from './projects/router'
import { jwtCheck } from './common/auth'
import { errorHandler, notFoundHandler } from './common/error-handlers'
import responseJsonHandler from './common/serializers/response-json'

// Configuration
const app = express()
app.response.json = responseJsonHandler

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(jwtCheck)

// Routes
app.use('/assets', assets)
app.use('/deployments', deployments)
app.use('/streams', streams)
app.use('/projects', projects)

// Fallbacks
app.use(errorHandler)
app.use(notFoundHandler)

export default app
