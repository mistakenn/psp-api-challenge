const { genInjectableDirModules } = require('../utils/dependency-injection')

module.exports = (dependencies) =>
  genInjectableDirModules(__dirname, dependencies, 'controllers')
