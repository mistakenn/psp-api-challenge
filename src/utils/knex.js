/**
 * @description Converte simplificadamente de camel case para snake case
 * @param {String} str
 * @returns {String}
 */
const camelToSnake = (str) => str.replace(
  /[\w]([A-Z])/g,
  (match) => `${match[0]}_${match[1]}`
).toLowerCase()

/**
 * @description Mapeia as chaves de um objeto
 * @param {Function} mapper
 * @param {Object} obj
 * @returns {Object}
 */
const keyMapper = (mapper, obj) => typeof obj !== 'object' || Array.isArray(obj)
  ? obj
  : Object.entries(obj).reduce((prev, [key, value]) => {
    prev[mapper(key)] = value
    return prev
  }, {})

/**
 * @description Converte simplificadamente de snake case para camel case
 * @param {String} str
 * @returns {String}
 */
const snakeToCamel = (str) => str.replace(
  /(_\w)/g,
  (match) => match[1].toUpperCase()
)

module.exports = {
  camelToSnake,
  keyMapper,
  snakeToCamel
}
