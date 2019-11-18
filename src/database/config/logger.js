const fs = require('fs')
const { join } = require('path')
const moment = require('moment')

const NODE_ENV = process.env.NODE_ENV || 'development'
const LOGS_DIR = join(__dirname, '/../logs')
const LOG_FILE = `knex.${NODE_ENV}.log`

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
    if (NODE_ENV === 'development') {
      console.log(compositeMessage)
    }
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = ({
  debug: (message) => logMessage('DEBUG', message),
  deprecate: (message) => logMessage('DEPRECATE', message),
  error: (message) => logMessage('ERROR', message),
  warn: (message) => logMessage('WARN', message)
})
