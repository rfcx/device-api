import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import deployments from './deployments'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/deployments', deployments)

export default app
