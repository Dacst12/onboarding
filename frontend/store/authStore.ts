import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '../types/auth'

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore