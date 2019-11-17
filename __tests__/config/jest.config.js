module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/{!(server),}.js'],
  moduleFileExtensions: ['js', 'json'],
  rootDir: '../../',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<roootDir>/src/server.js'],
  testRegex: '.test.js$'
}
