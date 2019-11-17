const Config = require('./config')
const Controllers = require('../controllers')
const express = require('express')
const generator = require('./generator')

module.exports = (dependencies) => {
  const router = express.Router()
  const controllers = Controllers(dependencies)
  const routes = Config(controllers)
  generator(router, routes)
  return router
}
