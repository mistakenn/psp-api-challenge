
const { safeAwait } = require('../../utils/await')

module.exports = ({ db }) => {
  /**
   * @description Grava um recebivel no banco
   * @param {{
   *   paymentDate: String,
   *   status: String,
   *   transactionId: Number,
   *   value: Number
   * }} data
   * @returns {Promise}
   */
  const create = ({
    paymentDate,
    status,
    transactionId,
    value
  }) => safeAwait(
    db('payable').returning(['id', 'createdAt']).insert({
      paymentDate,
      status,
      transactionId,
      value
    }).then((rows) => rows[0])
  )

  /**
   * @description Busca o valor total dos recebiveis no banco de cada status
   * @returns {Promise}
   */
  const getTotalValuesPerStatus = () => safeAwait(
    db('payable').select('status').sum('value as total').groupBy('status')
  )

  return {
    create,
    getTotalValuesPerStatus
  }
}
