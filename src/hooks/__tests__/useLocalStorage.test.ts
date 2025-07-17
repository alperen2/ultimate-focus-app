import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('should return parsed value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated-value');
    });
    
    expect(result.current[0]).toBe('updated-value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('updated-value'));
  });

  it('should handle complex objects', () => {
    const defaultValue = { name: 'test', count: 0 };
    const { result } = renderHook(() => useLocalStorage('test-object', defaultValue));
    
    const newValue = { name: 'updated', count: 5 };
    
    act(() => {
      result.current[1](newValue);
    });
    
    expect(result.current[0]).toEqual(newValue);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-object', JSON.stringify(newValue));
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json');
    
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