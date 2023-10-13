import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/dist/', '/node_modules/'],
    workerThreads: true, // Fix BigInt serialization see: https://github.com/jestjs/jest/issues/11617
};

export default config;
