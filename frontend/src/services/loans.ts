import type { Loan, LoanRequest, LoanStatus } from '../types'

const LOANS_KEY = 'makers-bank-loans'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadLoans(): Loan[] {
  const raw = localStorage.getItem(LOANS_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as Loan[]
  } catch {
    localStorage.removeItem(LOANS_KEY)
    return []
  }
}

function saveLoans(loans: Loan[]): void {
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans))
}

export function getLoansByUser(userEmail: string): Loan[] {
  return loadLoans()
    .filter((l) => l.userEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getAllLoans(): Loan[] {
  return loadLoans().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getPendingLoans(): Loan[] {
  return loadLoans()
    .filter((l) => l.status === 'PENDING')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function createLoan(userEmail: string, request: LoanRequest): Loan {
  const loans = loadLoans()
  const now = new Date().toISOString()

  const newLoan: Loan = {
    id: generateId(),
    userEmail,
    amount: request.amount,
    term: request.term,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  }

  loans.push(newLoan)
  saveLoans(loans)
  return newLoan
}

export function updateLoanStatus(loanId: string, status: LoanStatus): Loan | null {
  const loans = loadLoans()
  const index = loans.findIndex((l) => l.id === loanId)

  if (index === -1) return null

  loans[index] = {
    ...loans[index],
    status,
    updatedAt: new Date().toISOString(),
  }

  saveLoans(loans)
  return loans[index]
}

export function getLoanStats() {
  const loans = loadLoans()
  return {
    total: loans.length,
    pending: loans.filter((l) => l.status === 'PENDING').length,
    approved: loans.filter((l) => l.status === 'APPROVED').length,
    rejected: loans.filter((l) => l.status === 'REJECTED').length,
  }
}
