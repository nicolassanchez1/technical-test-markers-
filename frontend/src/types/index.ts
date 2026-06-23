export type UserRole = 'USER' | 'ADMIN'

export type AuthUser = {
  email: string
  name: string
  role: UserRole
  token: string
}

export type LoginForm = {
  email: string
  password: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  role: UserRole
}

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type Loan = {
  id: number
  userEmail: string
  amount: number
  status: LoanStatus
  createdAt: string
}

export type LoanRequest = {
  amount: number
}

export type LoanStatusUpdate = {
  status: 'APPROVED' | 'REJECTED'
}

export type ApiError = Error & {
  status: number
  error: string
  details?: Record<string, string>
}

export type ApiResponseError = {
  timestamp: string
  status: number
  error: string
  message: string
  details?: Record<string, string>
}
