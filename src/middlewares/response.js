const { createDefaultResponse } = require('../utils/response')

/**
 * @description Insere funcoes de envio de respostas padronizadas na response
 */
const responseHelpersMiddleware = (req, res, next) => {
  /**
   * @description Envia erro da requisicao de forma padronizada
   * @param {String} message
   * @param {Number} status
   */
  res.sendError = function (message = 'Internal Server Error', status = 500) {
    return this.status(status).json(createDefaultResponse(true, message))
  }

  /**
   * @description Envia resposta da requisicao de forma padronizada
   * @param {{ data: Any?, message: String? }} data
   * @param {Number} status
   */
  res.sendResponse = function ({ data = null, message = 'Done' } = {}, status = 200) {
    const error = status < 200 || status >= 300
    return this.status(status).json(createDefaultResponse(error, message, data))
  }

  next()
}

module.exports = { responseHelpersMiddleware }
