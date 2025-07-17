import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            dark:focus:border-indigo-400 dark:focus:ring-indigo-400
            dark:disabled:bg-gray-800 dark:disabled:text-gray-400
            ${leftIcon ? 'pl-10' : 'pl-3'}
            ${rightIcon ? 'pr-10' : 'pr-3'}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500 sm:text-sm">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default Input;