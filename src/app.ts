import express from 'express'
import cors from 'cors'
import assets from './assets/router'
import deployments from './deployments/router'
import streams from './streams/router'
import projects from './projects/router'
import guardians from './guardians/router'
import usertouch from './usertouch/router'
import classifiers from './classifiers/router'
import docs from './docs'
import { jwtCheck, jwtCustomCheck } from './common/auth'
import logging from './common/logging'
import { errorHandler, notFoundHandler } from './common/error-handlers'

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logging)

app.use('/docs', docs)

app.use(jwtCheck, jwtCustomCheck)

app.use('/assets', assets)
app.use('/deployments', deployments)
app.use('/streams', streams)
app.use('/projects', projects)
app.use('/guardians', guardians)
app.use('/usertouch', usertouch)
app.use('/classifiers', classifiers)

app.use(errorHandler)
app.use(notFoundHandler)

export default app
