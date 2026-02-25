import { createContext, useContext, useEffect, useState } from 'react'
import apiClient, { getCsrfCookie } from '@/lib/axios'

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true = checking session

  // Restore session on page reload
  useEffect(() => {
    apiClient
      .get('/api/user')
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    await getCsrfCookie()
    const { data } = await apiClient.post('/api/login', {
      email,
      password,
    })
    setUser(data.user)
  }

  const register = async (name, email, password, passwordConfirmation) => {
    await getCsrfCookie()
    const { data } = await apiClient.post('/api/register', {
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
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
