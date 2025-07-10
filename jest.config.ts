import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', 'crossbrowser\\.test\\.cjs$'],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: [
        '<rootDir>/src/**/*.(test|spec).[jt]s?(x)',
        '<rootDir>/__tests__/**/*.[jt]s?(x)',
    ],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.jest.json',
        },
    },
}

export default config
