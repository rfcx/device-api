import express from 'express'

const app = express()
app.get('/', (_req, res) => {
  res.send('Hello Typescript world!')
})

export default app
