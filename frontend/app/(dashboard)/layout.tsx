'use client';

import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Spinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMounted, user } = useAuth();

  // Show nothing while mounting to prevent hydration mismatch or flashing
  if (!isMounted) {
    return null; 
  }

  // If not authenticated, the useAuth hook will redirect. Show loading meanwhile.
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden md:ml-64 w-full">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
