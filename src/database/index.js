// Parser para transformar o tipo numerico em decimal ao recuperar o valor
const pg = require('pg')
pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat)

const { createConfig } = require('./config/configurator')
const DbRep = require('./repository')
const Knex = require('knex')
const KnexQueryBuilder = require('knex/lib/query/builder')
const moment = require('moment')
const paginator = require('./helpers/paginator')
const types = require('pg').types

const TIMESTAMP_OID = 1114
types.setTypeParser(TIMESTAMP_OID, (val) => val ? moment.utc(val).toISOString() : null)

/**
 * @description Cria uma instancia do banco de dados
 * @returns {Knex}
 */
const createDbInstance = () => {
  const instance = Knex(createConfig(process.env.NODE_ENV))
  KnexQueryBuilder.prototype.paginate = paginator
  instance.queryBuilder = function () {
    return new KnexQueryBuilder(instance.client)
  }
  return instance
}

module.exports = {
  DbRep,
  createDbInstance
}
