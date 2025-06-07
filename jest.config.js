// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    // Handle CSS imports (if any in components, otherwise not strictly needed for service tests)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    // Alias for Next.js modules if needed, but often handled by preset or transform
    // '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    // Use ts-jest for ts/tsx files
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // If you have babel transformations (e.g. for Next.js specific features not handled by ts-jest)
    // '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json', // Use a separate tsconfig for tests if needed
    },
  },
  // Coverage reporting (optional)
  // collectCoverage: true,
  // coverageDirectory: "coverage",
  // collectCoverageFrom: [
  //   "**/*.{ts,tsx}",
  //   "!**/*.d.ts",
  //   "!**/node_modules/**",
  //   "!<rootDir>/out/**",
  //   "!<rootDir>/.next/**",
  //   "!<rootDir>/*.config.js",
  //   "!<rootDir>/coverage/**",
  // ],
};
