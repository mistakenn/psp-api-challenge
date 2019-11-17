const { join } = require('path')
const logger = require('./logger')

/**
 * @description Cria uma configuracao padrao do banco
 * @param {{
 *   host: String,
 *   database: String,
 *   user: String,
 *   password: String
 * }} connection
 */
const createConfig = ({
  host = process.env.DB_HOST || '127.0.0.1',
  database = process.env.DB_NAME,
  user = process.env.DB_USER,
  password = process.env.DB_PASSWORD
} = {}) => ({
  client: 'postgresql',
  connection: {
    host,
    database,
    user,
    password,
    timezone: 'UTC'
  },
  pool: {
    min: 2,
    max: 10,
    afterCreate: (conn, cb) =>
      conn.query('set timezone="UTC";', (err) => cb(err, conn))
  },
  migrations: {
    directory: join(__dirname, '/../migrations'),
    tableName: 'migrations'
  },
  log: logger
})

module.exports = { createConfig }
