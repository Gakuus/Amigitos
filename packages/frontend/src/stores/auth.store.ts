import { create } from 'zustand';
import type { UserProfile } from '@amigitos/shared';
import { api } from '@/lib/api';
import { disconnectSocket } from '@/lib/socket';

interface AuthStore {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  init: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  updateCoins: (coins: number) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  refreshBalance: async () => {
    try {
      const { coins } = await api.getBalance();
      set((state) => state.user ? { user: { ...state.user, coins } } : {});
    } catch { /* ignore */ }
  },

  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await api.getMe();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ error: null, isLoading: true });
    try {
      const res = await api.login(email, password);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      set({ user: res.user, token: res.accessToken, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (email: string, name: string, password: string) => {
    set({ error: null, isLoading: true });
    try {
      const res = await api.register(email, name, password);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      set({ user: res.user, token: res.accessToken, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    disconnectSocket();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  updateCoins: (coins: number) => {
    const user = get().user;
    if (user) set({ user: { ...user, coins } });
  },
}));
