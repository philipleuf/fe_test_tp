module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // Set the test environment to jsdom
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'], // Include TypeScript and JavaScript extensions
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js"
  },

  setupFilesAfterEnv: ['@testing-library/jest-dom'], // For improved assertions
};