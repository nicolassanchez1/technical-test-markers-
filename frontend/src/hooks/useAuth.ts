import { useState, useRef } from 'react'
import type { AuthUser, LoginResponse, ApiError } from '../types'
import { AUTH_STORAGE_KEY } from '../constants'
import { api } from '../services/api'

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

function deriveNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}

export function useAuth() {
  const [session, setSession] = useState<AuthUser | null>(getStoredSession)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLoggingInRef = useRef(false)

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLoggingInRef.current) return false

    isLoggingInRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post<LoginResponse>(
        '/auth/login',
        { email, password },
        false,
      )

      const authUser: AuthUser = {
        email,
        name: deriveNameFromEmail(email),
        role: response.role,
        token: response.token,
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
      setSession(authUser)
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Error al iniciar sesion.')
      return false
    } finally {
      setIsLoading(false)
      isLoggingInRef.current = false
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(null)
    setError(null)
  }

  const clearError = () => setError(null)

  return { session, login, logout, isLoading, error, clearError }
}
