const { createDefaultResponse } = require('../utils/request')

/**
 * @description Insere funcoes de envio de respostas padronizadas na response
 */
const responseHelpersMiddleware = (req, res, next) => {
  /**
   * @description Envia uma mensagem de erro da requisicao de forma padronizada
   * @param {String} message
   * @param {Number} status
   */
  res.sendErrorMessage = function (message = 'Internal Server Error', status = 500) {
    return this.status(status).json(createDefaultResponse(true, message))
  }

  /**
   * @description Envia um erro da requisicao de forma padronizada e esconde a
   *   mensagem em producao se o erro nao for confiavel
   * @param {{
   *   error: Boolean,
   *   replacer: String,
   *   status: Number,
   *   trusted: Boolean
   * }} config
   */
  res.sendError = function ({
    error,
    forceStack = false,
    replacer = 'Internal Server Error',
    status = 500,
    trusted = false
  }) {
    const isDevelopment = process.env.NODE_ENV === 'development'
    let message = isDevelopment || trusted ? error.message : replacer
    if ((isDevelopment && !trusted) || forceStack) {
      message += ` (${error.stack.replace(/\s+/g, ' ')})`
    }
    return this.sendErrorMessage(message, status)
  }

  /**
   * @description Envia resposta da requisicao de forma padronizada
   * @param {{ data: Any?, message: String }} data
   * @param {Number} status
   */
  res.sendResponse = function ({ data = null, message = 'Done' } = {}, status = 200) {
    const error = status < 200 || status >= 300
    return this.status(status).json(createDefaultResponse(error, message, data))
  }

  next()
}

module.exports = { responseHelpersMiddleware }
