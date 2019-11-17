const { config } = require('dotenv')
const { responseHelpersMiddleware } = require('./middlewares/response')
const Router = require('./routes')
const cors = require('cors')
const express = require('express')

config()

const createMiddlewares = () => [
  cors(),
  responseHelpersMiddleware
]

const createRouter = (dependencies) => Router(dependencies)

const createApp = () => {
  const app = express()
  app.use(createMiddlewares())
  app.use(createRouter({}))
  return app
}

module.exports = createApp()
