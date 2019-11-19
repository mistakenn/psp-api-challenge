// Set decimal parser to numeric type
const pg = require('pg')
pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat)

const { createConfig } = require('./config/configurator')
const moment = require('moment')
const types = require('pg').types
const DbRep = require('./repository')
const Knex = require('knex')

const TIMESTAMP_OID = 1114
types.setTypeParser(TIMESTAMP_OID, (val) => val ? moment.utc(val).toISOString() : null)

/**
 * @description Cria uma instancia do banco de dados
 * @returns {Knex}
 */
const createDbInstance = () => Knex(createConfig(process.env.NODE_ENV))

module.exports = {
  DbRep,
  createDbInstance
}
