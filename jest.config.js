module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    'jest-html-reporters',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1"
  }
};
