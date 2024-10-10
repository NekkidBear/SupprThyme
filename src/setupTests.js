// Import any necessary testing libraries
import '@testing-library/jest-dom';

// Add any global test setup here
beforeAll(() => {
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
});

// Add any global test teardown here
afterAll(() => {
  // Clean up any global mocks or side effects
});
