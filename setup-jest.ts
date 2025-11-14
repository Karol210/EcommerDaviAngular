import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { TextEncoder, TextDecoder } from 'util';

setupZoneTestEnv();

// Polyfills globales
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Jasmine compatibility para Jest
(global as any).jasmine = {
  createSpyObj: (baseName: string, methodNames: string[], propertyNames?: any) => {
    const obj: any = {};
    
    // Agregar métodos spy con soporte para .and.returnValue()
    if (Array.isArray(methodNames)) {
      methodNames.forEach(method => {
        const mockFn = jest.fn();
        // Agregar compatibilidad con sintaxis Jasmine .and.returnValue()
        (mockFn as any).and = {
          returnValue: (value: any) => mockFn.mockReturnValue(value),
          callFake: (fn: any) => mockFn.mockImplementation(fn),
          throwError: (error: any) => mockFn.mockImplementation(() => { throw error; })
        };
        obj[method] = mockFn;
      });
    }
    
    // Agregar propiedades
    if (propertyNames && typeof propertyNames === 'object') {
      Object.keys(propertyNames).forEach(prop => {
        obj[prop] = propertyNames[prop];
      });
    }
    
    return obj;
  },
  createSpy: (name?: string) => {
    const mockFn = jest.fn();
    (mockFn as any).and = {
      returnValue: (value: any) => mockFn.mockReturnValue(value),
      callFake: (fn: any) => mockFn.mockImplementation(fn),
      throwError: (error: any) => mockFn.mockImplementation(() => { throw error; })
    };
    return mockFn;
  }
};

// Agregar spyOn global (Jest usa jest.spyOn)
(global as any).spyOn = jest.spyOn;

// Mock global de PrimeNG MessageService
import { Subject } from 'rxjs';
(global as any).MessageServiceMock = {
  messageObserver: new Subject(),
  clearObserver: new Subject(),
  add: jest.fn(),
  addAll: jest.fn(),
  clear: jest.fn()
};

// Mock global de PrimeNG ConfirmationService
(global as any).ConfirmationServiceMock = {
  requireConfirmation$: new Subject(),
  confirm: jest.fn(),
  close: jest.fn()
};

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock de ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock de sessionStorage
const mockStorage: Storage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage,
  writable: true
});

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true
});

