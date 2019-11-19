const { safeAwait } = require('../utils/await')
const moment = require('moment')

module.exports = ({ dbRep }) => {
  /**
   * @description Cria um payable a partir de uma transacao
   * @param {Object} transaction
   * @returns {Promise}
   */
  const createPayable = (transaction) => safeAwait(async () => {
    const isCredit = transaction.paymentMethod === 'credit_card'
    const fee = isCredit ? 0.05 : 0.03
    const paymentDate = isCredit
      ? moment(transaction.paymentDate).add(30, 'days')
      : moment(transaction.paymentDate)
    const payable = {
      transactionId: transaction.id,
      paymentDate: paymentDate.toISOString(),
      status: isCredit ? 'waiting_funds' : 'paid',
      value: transaction.value * (1 - fee)
    }
    const [payableDbError, dbPayable] = await dbRep.payable.create(payable)
    if (payableDbError) {
      throw payableDbError
    }
    return {
      ...payable,
      ...dbPayable
    }
  })

  return {
    createPayable
  }
}
