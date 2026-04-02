import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-gray-800 focus:ring-primary',
      secondary: 'bg-secondary text-white hover:bg-gray-700 focus:ring-secondary',
      danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
