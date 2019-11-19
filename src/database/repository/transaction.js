
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
    db('transaction').returning(['id', 'createdAt']).insert({
      cardLastDigits,
      description,
      paymentMethod,
      value
    }).then((rows) => rows[0])
  )

  /**
   * @description Busca todas as transacoes no banco
   * @returns {Promise}
   */
  const getAll = () => safeAwait(db('transaction').select())

  return {
    create,
    getAll
  }
}
