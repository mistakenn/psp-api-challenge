module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/database/(migrations|seeds)/*'
  ],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '../../',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/server.js',
    '<rootDir>/src/database/(migrations|seeds)'
  ],
  testRegex: '.test.js$'
}
