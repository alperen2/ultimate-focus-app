import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function LoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600 dark:text-indigo-400`} />
        {text && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

export default LoadingSpinner;