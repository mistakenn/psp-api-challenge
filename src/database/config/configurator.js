const { camelToSnake, keyMapper, snakeToCamel } = require('../../utils/knex')
const { join } = require('path')
const connectionConfig = require('./connection.config')
const logger = require('../helpers/logger')

/**
 * @description Cria uma configuracao padrao do banco
 * @param {String} env
 * @returns {Object}
 */
const createConfig = (env) => ({
  client: 'postgresql',
  connection: {
    ...connectionConfig[env === 'test' ? 'test' : 'default'],
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
  log: logger(env),
  wrapIdentifier: (value, origImpl) => origImpl(camelToSnake(value)),
  postProcessResponse: (data) => Array.isArray(data)
    ? data.map((row) => keyMapper(snakeToCamel, row))
    : keyMapper(snakeToCamel, data)
})

module.exports = { createConfig }
