const { join } = require('path')
const { lstatSync, readdirSync } = require('fs')

/**
 * @description Importa e injeta dependencias em todos os modulos de um
 *   diretorio, gerando um objeto
 * @param {String} rootPath
 * @param {Object} dependencies
 * @param {String} rootName
 * @returns {Object}
 */
const genInjectableDirModules = (
  rootPath,
  dependencies,
  rootName = 'rootModule'
) => {
  const root = {}
  const injectableDependencies = {
    ...dependencies,
    [rootName]: root
  }

  const generator = (path, dirObj = {}) => {
    if (!lstatSync(path).isDirectory()) {
      const module = require(path)
      return typeof module === 'function'
        ? module(injectableDependencies)
        : module
    }
    return readdirSync(path).reduce((prev, curr) => {
      if (curr === 'index.js') {
        return prev
      }
      const fullPath = join(path, curr)
      prev[curr.replace('.js', '')] = generator(fullPath)
      return prev
    }, dirObj)
  }

  return generator(rootPath, root)
}

module.exports = { genInjectableDirModules }
