import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
} as jest.Mocked<Storage>;

// Override global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should return default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('should return parsed value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'));
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated-value');
    });
    
    expect(result.current[0]).toBe('updated-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('updated-value'));
  });

  it('should handle complex objects', () => {
    const defaultValue = { name: 'test', count: 0 };
    const { result } = renderHook(() => useLocalStorage('test-object', defaultValue));
    
    const newValue = { name: 'updated', count: 5 };
    
    act(() => {
      result.current[1](newValue);
    });
    
    expect(result.current[0]).toEqual(newValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-object', JSON.stringify(newValue));
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('should work with arrays', () => {
    const defaultValue: number[] = [];
    const { result } = renderHook(() => useLocalStorage('test-array', defaultValue));
    
    const newArray = [1, 2, 3];
    
    act(() => {
      result.current[1](newArray);
    });
    
    expect(result.current[0]).toEqual(newArray);
  });
});