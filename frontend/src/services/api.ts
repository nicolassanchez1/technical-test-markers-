import { AUTH_STORAGE_KEY } from '../constants'
import type { ApiError } from '../types'

const BASE_URL = 'http://localhost:8080/api/v1'

type RequestOptions = {
  method?: string
  body?: unknown
  requiresAuth?: boolean
}

function getAuthToken(): string | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    const session = JSON.parse(raw)
    return session.token ?? null
  } catch {
    return null
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, requiresAuth = true } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (requiresAuth) {
    const token = getAuthToken()
    if (!token) {
      throw createApiError(401, 'No autenticado', 'Sesion expirada o invalida.')
    }
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw createApiError(
      response.status,
      errorData?.error ?? 'Error del servidor',
      errorData?.message ?? 'Ocurrio un error inesperado.',
      errorData?.details,
    )
  }

  return response.json() as Promise<T>
}

function createApiError(
  status: number,
  error: string,
  message: string,
  details?: Record<string, string>,
): ApiError {
  const apiError = new Error(message) as ApiError
  apiError.status = status
  apiError.error = error
  apiError.details = details
  return apiError
}

export const api = {
  post: <T>(endpoint: string, body: unknown, requiresAuth = true) =>
    request<T>(endpoint, { method: 'POST', body, requiresAuth }),

  get: <T>(endpoint: string, requiresAuth = true) =>
    request<T>(endpoint, { method: 'GET', requiresAuth }),

  patch: <T>(endpoint: string, body: unknown, requiresAuth = true) =>
    request<T>(endpoint, { method: 'PATCH', body, requiresAuth }),
}
