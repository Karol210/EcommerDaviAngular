module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/environments/**',
    '!src/**/*.module.ts'
  ],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@environments/(.*)$': '<rootDir>/src/environments/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@primeng|primeng|@primeuix)/)'
  ],
  testMatch: [
    '**/*.spec.ts'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs']
};

