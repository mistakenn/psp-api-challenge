/**
 * @description Gera um controller que apenas envia uma mensagem como resposta
 * @param {String} message
 * @returns {Function}
 */
const simpleResponseController = (message) => (req, res) =>
  res.sendResponse({ message })

/**
 * @description Definicao das rotas da API
 *  Super-rota: { path: String, subroutes: Array }
 *  Rota: { path: String, method: String, controller: Function }
 * @param {Object} controllers
 */
module.exports = (controllers) => ({
  path: '/api',
  subroutes: [
    {
      path: '/',
      method: 'get',
      controller: simpleResponseController('PSP Challenge API')
    },
    {
      path: '/health',
      method: 'get',
      controller: simpleResponseController('Ok')
    },
    {
      path: '/transaction',
      subroutes: [
        {
          path: '/',
          method: 'post',
          controller: controllers.transaction.processTransactionController
        }
      ]
    }
  ]
})
