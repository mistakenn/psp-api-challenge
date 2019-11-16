/**
 * @description Cria a resposta padrao da API
 * @param {Boolean} error
 * @param {String?} message
 * @param {Any?} data
 * @returns {{ data: Any?, error: Boolean, message: String? }}
 */
const createDefaultMessage = (error, message, data = null) => ({
  data,
  error,
  message
})

/**
 * @description Envia erro da requisicao de forma padronizada
 * @param {String} message
 * @param {Number} status
 */
function sendError (message = 'Internal Server Error', status = 500) {
  this.status(status).json(createDefaultMessage(true, message))
}

/**
 * @description Envia resposta da requisicao de forma padronizada
 * @param {{ data: Any?, message: String? }} data
 * @param {Number} status
 */
function sendResponse ({ data = null, message = 'Done' } = {}, status = 200) {
  const error = status < 200 || status >= 300
  this.status(status).json(createDefaultMessage(error, message, data))
}

/**
 * @description Insere funcoes de envio de respostas padronizadas na response
 */
const responseHelpersMiddleware = (req, res, next) => {
  res.sendResponse = sendResponse
  res.sendError = sendError
  next()
}

module.exports = {
  responseHelpersMiddleware
}
