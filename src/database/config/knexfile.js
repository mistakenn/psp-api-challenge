const { createConfig } = require('./configurator')

module.exports = {
  development: createConfig('development'),
  production: createConfig('production'),
  test: createConfig('test')
}
