import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Correct environment for React testing
    setupFiles: ['./tests/setup.js'], // Setup file for global mocks and configurations
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], // Include pattern for test files
    coverage: {
      reporter: ['text', 'json', 'html'], // Coverage reporters
      exclude: [
        'node_modules/',
        'tests/setup.js', // Exclude setup file from coverage
      ],
    },
    watch: true, // Enable watch mode for development
    resolve: {
      alias: {
        lodash: path.resolve(__dirname, 'node_modules/lodash'), // Alias for lodash
      },
    },
  },
});