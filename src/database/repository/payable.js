
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

  return { create }
}
