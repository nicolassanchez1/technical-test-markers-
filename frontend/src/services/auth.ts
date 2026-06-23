import type { AuthUser, UserRole } from '../types'

const AUTH_KEY = 'makers-bank-auth'

type MockUser = AuthUser & { password: string }

const MOCK_USERS: MockUser[] = [
  {
    email: 'usuario@test.com',
    password: '123',
    name: 'Usuario Demo',
    role: 'USER',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-user-token',
  },
  {
    email: 'admin@test.com',
    password: '123',
    name: 'Admin Demo',
    role: 'ADMIN',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-admin-token',
  },
]

export function login(email: string, password: string): AuthUser | null {
  const user = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password,
  )

  if (!user) return null

  const { password: _, ...authUser } = user
  localStorage.setItem(AUTH_KEY, JSON.stringify(authUser))
  return authUser
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function getSession(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_KEY)
    return null
  }
}

export function hasRole(requiredRole: UserRole): boolean {
  const session = getSession()
  return session?.role === requiredRole
}
