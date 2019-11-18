const { join } = require('path')
const { lstatSync, readdirSync } = require('fs')

const genInjectableDirModules = (root, dependencies) => {
  /**
   * @description Importa todos os modulos de um caminho, injeta as dependencias
   *   e retorna um objeto contendo-os
   * @param {String} path
   * @returns {Object}
   */
  const generator = (path) => {
    if (!lstatSync(path).isDirectory()) {
      const module = require(path)
      return typeof module === 'function'
        ? module(dependencies)
        : module
    }
    return readdirSync(path).reduce((prev, curr) => {
      if (curr === 'index.js') {
        return prev
      }
      const fullPath = join(path, curr)
      prev[curr.replace('.js', '')] = generator(fullPath)
      return prev
    }, {})
  }

  return generator(root)
}

module.exports = { genInjectableDirModules }
