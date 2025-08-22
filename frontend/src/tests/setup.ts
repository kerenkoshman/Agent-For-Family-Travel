import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollTo
global.scrollTo = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Global test utilities
global.testUtils = {
  // Helper to create mock user
  createMockUser: (overrides = {}) => ({
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: 'https://example.com/avatar.jpg',
    ...overrides,
  }),

  // Helper to create mock trip
  createMockTrip: (overrides = {}) => ({
    id: 'trip-123',
    familyId: 'family-123',
    title: 'Test Trip',
    description: 'A test trip',
    destination: 'Paris, France',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-08'),
    budget: 5000,
    currency: 'USD',
    status: 'planning',
    preferences: {
      accommodationType: ['hotel'],
      transportationType: ['public'],
      activityTypes: ['cultural'],
      diningPreferences: ['local'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  // Helper to create mock family profile
  createMockFamilyProfile: (overrides = {}) => ({
    id: 'family-123',
    userId: 'user-123',
    name: 'Test Family',
    description: 'A test family',
    preferences: {
      interests: ['beaches', 'culture'],
      budget: { min: 1000, max: 5000, currency: 'USD' },
      travelStyle: ['relaxation'],
      dietaryRestrictions: [],
      accessibility: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  // Helper to mock API responses
  mockApiResponse: (url: string, response: any, status = 200) => {
    (global.fetch as any).mockImplementation((requestUrl: string) => {
      if (requestUrl.includes(url)) {
        return Promise.resolve({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(response),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  },

  // Helper to mock API error
  mockApiError: (url: string, error = 'Network error', status = 500) => {
    (global.fetch as any).mockImplementation((requestUrl: string) => {
      if (requestUrl.includes(url)) {
        return Promise.resolve({
          ok: false,
          status,
          json: () => Promise.resolve({ error }),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  },

  // Helper to wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
