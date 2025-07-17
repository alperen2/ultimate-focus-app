/**
 * Performance monitoring and optimization utilities
 */

/**
 * Performance measurement utility
 */
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static start(name: string): void {
    this.measurements.set(name, performance.now());
  }

  static end(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No measurement found for ${name}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.measurements.delete(name);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  static measure<T>(name: string, fn: () => T): T {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  }

  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    const result = await fn();
    this.end(name);
    return result;
  }
}

/**
 * Debounce utility for performance optimization
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle utility for performance optimization
 */
export function throttle<T extends (...args: never[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoization utility for expensive calculations
 */
export function memoize<T extends (...args: never[]) => unknown>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

/**
 * Lazy loading utility for components
 */
export function createLazyLoader<T extends React.ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>
) {
  return React.lazy(importFn);
}

/**
 * Image optimization utilities
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Local storage with compression
 */
export class CompressedStorage {
  private static compress(value: string): string {
    // Simple compression - in production, use a proper compression library
    return btoa(value);
  }

  private static decompress(value: string): string {
    try {
      return atob(value);
    } catch {
      return value; // Fallback for non-compressed data
    }
  }

  static setItem(key: string, value: unknown): void {
    try {
      const serialized = JSON.stringify(value);
      const compressed = this.compress(serialized);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      
      const decompressed = this.decompress(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

/**
 * Bundle size utilities
 */
export function analyzeBundle(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available with npm run build:analyze');
  }
}

/**
 * Memory usage monitoring
 */
export function logMemoryUsage(): void {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memInfo = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    console.log('Memory usage:', {
      used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024) + ' MB',
    });
  }
}

import React from 'react';