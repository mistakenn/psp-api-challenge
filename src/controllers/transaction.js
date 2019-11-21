const { validate } = require('../utils/validation')
const Joi = require('joi')
const moment = require('moment')

module.exports = ({ controllers, dbRep }) => {
  const pageSchema = Joi.object({
    includeTotal: Joi.boolean().default(false),
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(
      parseInt(process.env.PAGE_SIZE) || 30
    )
  })

  const transactionSchema = Joi.object({
    card: Joi.object({
      cvv: Joi.string().min(3).max(4).regex(/^[0-9]*$/).required(),
      expiration: Joi.string().regex(/^[0-9]{2}\/[0-9]{4}$/).required(),
      owner: Joi.string().max(80).required(),
      number: Joi.string().creditCard().required()
    }).required(),
    description: Joi.string().max(100).required(),
    paymentMethod: Joi.string().valid('debit_card', 'credit_card').required(),
    value: Joi.number().min(0.01).max(1e9).precision(2).required()
  })

  /**
   * @description Rota de busca de transacoes realizadas
   */
  const getTransactionsController = async (req, res) => {
    const defaultError = 'Failed to get transactions'
    const [validationError, pageParams] = validate(pageSchema, req.query)
    if (validationError) {
      return res.sendError({ error: validationError, status: 400, trusted: true })
    }
    const [dbError, transactions] = await dbRep.transaction.getPage(
      pageParams.page,
      pageParams.pageSize,
      pageParams.includeTotal
    )
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
    const cardExpiration = moment(
      transaction.card.expiration.split('/').reverse().join('-')
    )
    if (!cardExpiration.isValid()) {
      const invalidExpirationError = new Error('Invalid expiration date')
      return res.sendError({
        error: invalidExpirationError,
        status: 400,
        trusted: true
      })
    }
    if (moment().isAfter(cardExpiration)) {
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
    const [payableError] = await controllers.payable.createPayable(dbTransaction)
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
