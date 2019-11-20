const { safeAwait } = require('../utils/await')
const moment = require('moment')

const BALANCE_KEYS_MAPPING = {
  paid: 'available',
  waiting_funds: 'waiting_funds'
}

module.exports = ({ dbRep }) => {
  /**
   * @description Rota de calculo de saldo
   */
  const balanceController = async (req, res) => {
    const defaultError = 'Failed to calculate balance'
    const [dbError, totalValues] = await dbRep.payable.getTotalValuesPerStatus()
    if (dbError) {
      return res.sendError({ error: dbError, replacer: defaultError })
    }
    const balance = totalValues.reduce((prev, { status, total }) => {
      const balanceKey = BALANCE_KEYS_MAPPING[status]
      if (balanceKey) {
        prev[balanceKey] = total
      }
      return prev
    }, {})
    return res.sendResponse({
      data: balance,
      message: 'Current balance'
    })
  }

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
    const [dbError, dbPayable] = await dbRep.payable.create(payable)
    if (dbError) {
      throw dbError
    }
    return dbPayable
  })

  return {
    balanceController,
    createPayable
  }
}
