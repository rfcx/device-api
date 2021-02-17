import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import deployments from './deployments'
import projects from './routes/projects'
import stream from './routes/streams'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/deployments', deployments)
app.use('/projects', projects)
app.use('/streams', stream)

export default app
