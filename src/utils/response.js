/**
 * @description Cria a resposta padrao da API
 * @param {Boolean} error
 * @param {String?} message
 * @param {Any?} data
 * @returns {{ data: Any?, error: Boolean, message: String? }}
 */
const createDefaultResponse = (error, message, data = null) => ({
  data,
  error,
  message
})

module.exports = { createDefaultResponse }
