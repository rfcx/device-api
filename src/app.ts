import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const apiRoutes = require('./routes/route')
for (const routeName in apiRoutes) {
  for (const route in apiRoutes[routeName]) {
    app.use('/'+ routeName, apiRoutes[routeName][route])
  }
}

export default app
