const fs = require('fs')
const { join } = require('path')
const moment = require('moment')

const LOGS_DIR = join(__dirname, '/../logs')

module.exports = (env) => {
  const LOG_FILE = `knex.${env}.log`

  /**
   * @description Insere uma mensagem no log
   * @param {String} type
   * @param {String} message
   */
  const logMessage = (type, message) => {
    try {
      if (!fs.existsSync(LOGS_DIR)) {
        fs.mkdirSync(LOGS_DIR)
      }
      const compositeMessage = `${moment().toISOString()} <${type}>: ${message}\n`
      fs.appendFileSync(
        join(LOGS_DIR, LOG_FILE),
        compositeMessage
      )
      if (env === 'development') {
        console.log(compositeMessage)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  return {
    debug: (message) => logMessage('DEBUG', message),
    deprecate: (message) => logMessage('DEPRECATE', message),
    error: (message) => logMessage('ERROR', message),
    warn: (message) => logMessage('WARN', message)
  }
}
