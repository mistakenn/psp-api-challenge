const { validate } = require('../utils/validation')
const Joi = require('joi')
const moment = require('moment')

const transactionSchema = Joi.object({
  card: Joi.object({
    cvv: Joi.string().min(3).max(4).regex(/^[0-9]*$/).required(),
    expiration: Joi.date().required(),
    owner: Joi.string().max(80).required(),
    number: Joi.string().creditCard().required()
  }).required(),
  description: Joi.string().max(100).required(),
  paymentMethod: Joi.string().valid('debit_card', 'credit_card').required(),
  value: Joi.number().min(0.01).max(1e9).precision(2).required()
})

module.exports = ({ controllers, dbRep }) => {
  /**
   * @description Rota de processamento de transacao
   */
  const getTransactionsController = async (req, res) => {
    const defaultError = 'Failed to get transactions'
    const [dbError, transactions] = await dbRep.transaction.getAll()
    if (dbError) {
      return res.sendError({ error: dbError, replacer: defaultError })
    }
    return res.sendResponse({
      data: transactions,
      message: 'Transactions list'
    })
  }

  /**
   * @description Rota de processamento de transacao
   */
  const processTransactionController = async (req, res) => {
    const defaultError = 'Failed to process transaction'
    const [validationError, transaction] = validate(transactionSchema, req.body)
    if (validationError) {
      return res.sendError({ error: validationError, status: 400, trusted: true })
    }
    if (moment().isAfter(transaction.card.expiration)) {
      const expiredCardError = new Error('Expired card')
      return res.sendError({ error: expiredCardError, status: 400, trusted: true })
    }
    const [transactionDbError, dbTransaction] = await dbRep.transaction.create({
      cardLastDigits: transaction.card.number.slice(-4),
      description: transaction.description,
      paymentMethod: transaction.paymentMethod,
      value: transaction.value
    })
    if (transactionDbError) {
      return res.sendError({ error: transactionDbError, replacer: defaultError })
    }
    const [payableError] = await controllers.payable.createPayable({
      ...transaction,
      ...dbTransaction
    })
    if (payableError) {
      return res.sendError({ error: payableError, replacer: defaultError })
    }
    return res.sendResponse({
      data: { id: dbTransaction.id },
      message: 'Transaction processed'
    })
  }

  return {
    getTransactionsController,
    processTransactionController
  }
}
