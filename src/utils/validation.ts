/**
 * Validation utilities for form inputs and data
 */

import { ValidationError } from '@/lib/errors';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTaskText(text: string): void {
  if (!text.trim()) {
    throw new ValidationError('Task text cannot be empty');
  }
  
  if (text.length > 200) {
    throw new ValidationError('Task text cannot exceed 200 characters');
  }
}

export function validateProjectName(name: string): void {
  if (!name.trim()) {
    throw new ValidationError('Project name cannot be empty');
  }
  
  if (name.length > 100) {
    throw new ValidationError('Project name cannot exceed 100 characters');
  }
}

export function validateTimerDuration(duration: number): void {
  if (duration < 1) {
    throw new ValidationError('Timer duration must be at least 1 minute');
  }
  
  if (duration > 120) {
    throw new ValidationError('Timer duration cannot exceed 120 minutes');
  }
}

export function validateDailyGoal(goal: number): void {
  if (goal < 1) {
    throw new ValidationError('Daily goal must be at least 1 session');
  }
  
  if (goal > 20) {
    throw new ValidationError('Daily goal cannot exceed 20 sessions');
  }
}

export function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function validateRequiredString(value: string, fieldName: string): void {
  if (!value || !value.trim()) {
    throw new ValidationError(`${fieldName} is required`);
  }
}