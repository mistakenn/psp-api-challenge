const { config } = require('dotenv')
const { createConfig } = require('./configurator')

config({ path: '../../../.env' })

module.exports = {
  development: createConfig(),
  production: createConfig(),
  test: createConfig({
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    database: process.env.TEST_DB_NAME,
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD
  })
}
