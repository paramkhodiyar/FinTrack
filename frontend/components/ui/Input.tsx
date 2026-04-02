import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "block w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-gray-100 disabled:text-gray-500",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
