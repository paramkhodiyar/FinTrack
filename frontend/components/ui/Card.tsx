import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn("bg-white rounded-lg border border-border shadow-sm", className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn("px-6 py-4 border-b border-border", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }: CardProps) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn("px-6 py-4 border-t border-border bg-gray-50 rounded-b-lg", className)} {...props}>
      {children}
    </div>
  );
};
