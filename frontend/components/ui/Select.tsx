import React from 'react';
import { cn } from './Button';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "block w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-gray-100 disabled:text-gray-500",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
