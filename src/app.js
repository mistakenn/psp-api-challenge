const { config } = require('dotenv')
const { responseHelpersMiddleware } = require('./middlewares/response')
const cors = require('cors')
const express = require('express')

config()

const createMiddlewares = () => [
  cors(),
  responseHelpersMiddleware
]

const createApp = () => {
  const app = express()
  app.use(createMiddlewares())
  return app
}

module.exports = createApp()
