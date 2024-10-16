import '@testing-library/jest-dom';
import { vi } from 'vitest';
import isEqualWith from 'lodash/isEqualWith';
import isEqual from 'lodash/isEqual';

// Make lodash functions available globally
global.isEqualWith = isEqualWith;
global.isEqual = isEqual;

// Add any other global setup here, such as mocking global objects or setting up test database connections

// Mock fetch API
global.fetch = vi.fn();

// Setup mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
