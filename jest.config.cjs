module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/i18n/**/*.{ts,tsx}',
    'src/components/LanguageSwitcher.tsx',
    'src/components/mode-toggle.tsx',
    'src/components/RemoveMemberButton.tsx',
    'src/components/events/EventsList.tsx',
    'src/components/funds/FundsTabs.tsx',
    'src/components/team/TeamList.tsx',
    'src/components/landing/CapabilitiesSection.tsx',
    'src/components/landing/FinalCta.tsx',
    'src/components/landing/Footer.tsx',
    'src/components/landing/HeroSection.tsx',
    'src/components/landing/HowItWorksSection.tsx',
    'src/components/landing/LandingHeader.tsx',
    'src/components/landing/ShowcasesSection.tsx',
    'src/components/landing/SocialProofBar.tsx',
    'src/components/landing/TestimonialsSection.tsx',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/lib/auth-user.ts',
    '<rootDir>/src/lib/db.ts',
    '<rootDir>/src/lib/mailer.ts',
    '<rootDir>/src/lib/notifications.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
