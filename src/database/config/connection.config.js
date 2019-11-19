if (!process.env.DB_HOST) {
  require('dotenv').config({ path: `${__dirname}/../../../.env` })
}

module.exports = {
  default: {
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  test: {
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || '127.0.0.1',
    database: process.env.TEST_DB_NAME,
    user: process.env.TEST_DB_USER || process.env.DB_USER,
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD
  }
}
