module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.spec.js"],
  extensionsToTreatAsEsm: [".jsx"],
  transform: {
    "^.+\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|webp|avif|bmp|svg)$":
      "<rootDir>/tests/__mocks__/fileMock.cjs",
  },
  moduleFileExtensions: ["js", "jsx", "mjs", "cjs", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
  testTimeout: 20000,
};
