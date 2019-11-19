/**
 * @description Encapsula um try...catch para um await
 * @param {Function|Promise} fn
 * @returns {[ error: Error?, data: any? ]}
 */
const safeAwait = async (fn) => {
  try {
    return [null, await (typeof fn === 'function' ? fn() : fn)]
  } catch (err) {
    return [err, null]
  }
}

module.exports = { safeAwait }
