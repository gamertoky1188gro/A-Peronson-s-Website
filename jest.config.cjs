module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],
  extensionsToTreatAsEsm: ['.jsx'],
  transform: {
    '^.+\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testTimeout: 20000,
}
