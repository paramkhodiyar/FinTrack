import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'ADMIN' | 'ENTRY_RECORDER' | 'ANALYST' | 'USER';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'financial-manager-auth',
    }
  )
);
