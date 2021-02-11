import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const apiRoutes = require('./routes/route')
for (const routeName in apiRoutes) {
  for (const route in apiRoutes[routeName]) {
    app.use('/'+ routeName, apiRoutes[routeName][route])
  }
}

export default app
