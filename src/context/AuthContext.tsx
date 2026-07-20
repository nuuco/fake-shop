import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { AuthStatus, AuthUser } from '../types/auth'

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  errorMessage: string | null
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuth()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext는 AuthProvider 안에서만 사용할 수 있습니다.')
  }
  return ctx
}
