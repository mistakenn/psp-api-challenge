
const { safeAwait } = require('../../utils/await')

module.exports = ({ db }) => {
  /**
   * @description Grava uma transacao no banco
   * @param {{
   *   cardLastDigits: String,
   *   description: String,
   *   paymentMethod: String,
   *   value: Number
   * }} data
   * @returns {Promise}
   */
  const create = ({
    cardLastDigits,
    description,
    paymentMethod,
    value
  }) => safeAwait(
    db('transaction').returning('*').insert({
      cardLastDigits,
      description,
      paymentMethod,
      value
    }).then((rows) => rows[0])
  )

  /**
   * @description Busca todas as transacoes no banco
   * @param {Number} page
   * @param {Number} pageSize
   * @param {Boolean} includeTotal
   * @returns {Promise}
   */
  const getPage = (page, pageSize, includeTotal = false) => safeAwait(
    db('transaction').paginate(page, pageSize, includeTotal)
  )

  return {
    create,
    getPage
  }
}
