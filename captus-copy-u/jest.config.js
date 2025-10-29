export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'backend/src/**/*.js',
    '!backend/src/**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: [],
  transformIgnorePatterns: [
    'node_modules/(?!(supabase-js|@supabase)/)'
  ]
};
