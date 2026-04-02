import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';

export const Navbar = () => {
  const { user, isMounted } = useAuth();

  if (!isMounted || !user) return null;

  return (
    <header className="bg-white border-b border-border h-16 flex items-center px-8 shadow-sm">
      <div className="flex-1 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end text-sm">
            <span className="font-medium text-gray-900">{user.name}</span>
            <span className="text-gray-500">{user.email}</span>
          </div>
          <div className="flex flex-col items-start space-y-1">
             <Badge variant="info">{user.role}</Badge>
          </div>
        </div>
      </div>
    </header>
  );
};
