import { create } from "zustand";
import { loginApi } from './authApi';

type User = { username: string };

type AuthState = {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  hydrated: boolean;
  login: (username: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  user: null,
  isAuth: Boolean(typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null),
  hydrated: false,
  login: async (username, password, remember) => {
    const data = await loginApi(username, password);
    const token = data?.accessToken ?? null;
    if (token) {
      set({ token, user: { username }, isAuth: true, hydrated: true });
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem('auth_token', token);
    }
  },
  logout: () => {
    set({ token: null, user: null, isAuth: false, hydrated: true });
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  },
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const t = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
    set({ token: t, isAuth: Boolean(t), hydrated: true });
  },
}));
