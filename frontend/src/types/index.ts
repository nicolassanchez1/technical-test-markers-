export type UserRole = 'USER' | 'ADMIN'

export type AuthUser = {
  email: string
  name: string
  role: UserRole
  token: string
}

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type Loan = {
  id: string
  userEmail: string
  amount: number
  term: number
  status: LoanStatus
  createdAt: string
  updatedAt: string
}

export type LoanRequest = {
  amount: number
  term: number
}

export type LoginForm = {
  email: string
  password: string
}
