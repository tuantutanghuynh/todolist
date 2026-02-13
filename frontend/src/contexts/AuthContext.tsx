import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import apiClient, { getCsrfCookie } from '@/lib/axios'
import type { User } from '@/types/auth'

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>
  logout: () => Promise<void>
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // true = đang kiểm tra session

  // Khôi phục session khi tải lại trang
  useEffect(() => {
    apiClient
      .get<{ user: User }>('/api/user')
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    await getCsrfCookie()
    const { data } = await apiClient.post<{ user: User }>('/api/login', {
      email,
      password,
    })
    setUser(data.user)
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => {
    await getCsrfCookie()
    const { data } = await apiClient.post<{ user: User }>('/api/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    setUser(data.user)
  }

  const logout = async () => {
    await apiClient.post('/api/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>')
  return ctx
}
