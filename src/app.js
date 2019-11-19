const { responseHelpersMiddleware } = require('./middlewares/request')
const { config } = require('dotenv')
const { createDbInstance, DbRep } = require('./database')
const Router = require('./routes')
const cors = require('cors')
const express = require('express')

config({ path: `${__dirname}/../.env` })

const createMiddlewares = () => [
  cors(),
  express.json(),
  responseHelpersMiddleware
]

const createRepository = (db) => DbRep({ db })

const createRouter = (dbRep) => Router({ dbRep })

const createApp = () => {
  const app = express()
  const db = createDbInstance()
  const dbRepository = createRepository(db)
  const router = createRouter(dbRepository)
  app.use(createMiddlewares())
  app.use(router)
  return app
}

module.exports = createApp()
