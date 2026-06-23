import { useState } from 'react'
import type { AuthUser } from '../types'
import { AUTH_STORAGE_KEY, MOCK_USERS } from '../constants'

function getStoredSession(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function useAuth() {
  const [session, setSession] = useState<AuthUser | null>(getStoredSession)

  const login = (email: string, password: string): boolean => {
    const user = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    )

    if (!user) return false

    const { password: _, ...authUser } = user
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
    setSession(authUser)
    return true
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(null)
  }

  return { session, login, logout }
}
