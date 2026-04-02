import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './Button';

interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ className, size = 'md', ...props }: SpinnerProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <Loader2 
      className={cn("animate-spin text-accent", sizes[size], className)} 
      {...props} 
    />
  );
};
