import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import assets from './assets/router'
import deployments from './deployments/router'
import streams from './streams/router'
import projects from './projects/router'
import { jwtCheck } from './common/auth'
import { errorHandler, notFoundHandler } from './common/error-handlers'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(jwtCheck)

app.use('/assets', assets)
app.use('/deployments', deployments)
app.use('/streams', streams)
app.use('/projects', projects)

app.use(errorHandler)
app.use(notFoundHandler)

export default app
