import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup.js',
      ],
    },
    globals: true,
    watch: true,
    resolve: {
      alias: {
        lodash: path.resolve(__dirname, 'node_modules/lodash'),
      },
    },
  },
});