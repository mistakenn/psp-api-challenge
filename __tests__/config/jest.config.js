module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/database/(helpers|migrations|seeds)/*',
    '!src/database/config/knexfile.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '../../',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/server.js',
    '<rootDir>/src/database/config/knexfile.js',
    '<rootDir>/src/database/(helpers|migrations|seeds)'
  ],
  testRegex: '.test.js$'
}
