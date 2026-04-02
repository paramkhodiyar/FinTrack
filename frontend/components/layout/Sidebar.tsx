import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FileText, Users, LogOut, Wallet } from 'lucide-react';
import { cn } from '../ui/Button';

export const Sidebar = () => {
  const pathname = usePathname();
  const { hasRole, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Records', href: '/records', icon: FileText, show: true },
    { name: 'Categories', href: '/categories', icon: Wallet, show: true }, 
    { name: 'Budgets', href: '/budgets', icon: Wallet, show: true }, 
    { name: 'Users', href: '/users', icon: Users, show: hasRole(['ADMIN']) },
  ];

  return (
    <div className="flex w-64 flex-col fixed inset-y-0 bg-white border-r border-border">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-primary">FinTrack</h1>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
        {navigation.filter(item => item.show).map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-100 text-accent"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 shrink-0",
                  isActive ? "text-accent" : "text-gray-400 group-hover:text-gray-500"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
};
