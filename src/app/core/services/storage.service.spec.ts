import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let mockSessionStorage: jest.Mocked<Storage>;

  beforeEach(() => {
    // Mock de sessionStorage
    mockSessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
      configurable: true
    });

    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store a string value encrypted in Base64', () => {
      const key = 'testKey';
      const value = 'testValue';

      const result = service.setItem(key, value);

      expect(result).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(key, expect.any(String));
    });

    it('should store an object value encrypted in Base64', () => {
      const key = 'testKey';
      const value = { name: 'John', age: 30 };

      const result = service.setItem(key, value);

      expect(result).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(key, expect.any(String));
    });

    it('should return false on error', () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = service.setItem('key', 'value');

      expect(result).toBe(false);
    });
  });

  describe('getItem', () => {
    it('should retrieve and decrypt a string value', () => {
      const key = 'testKey';
      const originalValue = 'testValue';
      
      service.setItem(key, originalValue);
      const encryptedValue = (mockSessionStorage.setItem as jest.Mock).mock.calls[0][1];
      
      mockSessionStorage.getItem.mockReturnValue(encryptedValue);

      const result = service.getItem<string>(key);

      expect(result).toBe(originalValue);
    });

    it('should return null if key does not exist', () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      const result = service.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null on decryption error', () => {
      mockSessionStorage.getItem.mockReturnValue('invalid-base64');
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = service.getItem('key');

      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove an item from sessionStorage', () => {
      const key = 'testKey';

      service.removeItem(key);

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe('clear', () => {
    it('should clear all sessionStorage', () => {
      service.clear();

      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('hasItem', () => {
    it('should return true if key exists', () => {
      mockSessionStorage.getItem.mockReturnValue('someValue');

      const result = service.hasItem('existingKey');

      expect(result).toBe(true);
    });

    it('should return false if key does not exist', () => {
      mockSessionStorage.getItem.mockReturnValue(null);

      const result = service.hasItem('nonexistentKey');

      expect(result).toBe(false);
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys from sessionStorage', () => {
      mockSessionStorage.key.mockReturnValueOnce('key1')
        .mockReturnValueOnce('key2')
        .mockReturnValueOnce('key3');
      Object.defineProperty(mockSessionStorage, 'length', {
        get: () => 3,
        configurable: true
      });

      const keys = service.getAllKeys();

      expect(keys).toEqual(['key1', 'key2', 'key3']);
    });

    it('should return empty array if no keys exist', () => {
      Object.defineProperty(mockSessionStorage, 'length', {
        get: () => 0,
        configurable: true
      });

      const keys = service.getAllKeys();

      expect(keys).toEqual([]);
    });
  });
});
