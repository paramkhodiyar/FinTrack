import React from 'react';
import { PackageX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ 
  message = "No data available", 
  icon = <PackageX className="h-10 w-10 text-gray-400 mb-3" /> 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-gray-50 border-dashed">
      {icon}
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
};
