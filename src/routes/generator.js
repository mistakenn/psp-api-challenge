/**
 * @description Cria as rotas no formato do 'config.js' no router
 * @param {Express.Router} router
 * @param {Object} routes
 * @param {String?} relativePath
 */
const createRoutes = (router, routes, relativePath = '') => {
  const routesArray = Array.isArray(routes) ? routes : [routes]
  routesArray.forEach((route) => {
    const fullPath = `${relativePath}${route.path}`
    if (route.subroutes) {
      return createRoutes(router, route.subroutes, fullPath)
    }
    router[route.method](fullPath, route.controller)
  })
}

module.exports = createRoutes
