import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, setAuth, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated() && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated() && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, pathname, router, mounted]);

  const hasRole = (allowedRoles: string[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return { user, token, logout, hasRole, isMounted: mounted };
};
