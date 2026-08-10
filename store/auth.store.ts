"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
      setLoading: (loading) => set({ isLoading: loading }),

      isLoggedIn: () => !!get().user,
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    {
      name: "marqet-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
