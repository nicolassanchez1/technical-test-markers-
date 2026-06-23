import { useState } from 'react'
import type { Loan, LoanRequest, LoanStatus } from '../types'
import { LOANS_STORAGE_KEY } from '../constants'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadLoans(): Loan[] {
  const raw = localStorage.getItem(LOANS_STORAGE_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as Loan[]
  } catch {
    localStorage.removeItem(LOANS_STORAGE_KEY)
    return []
  }
}

function saveLoans(loans: Loan[]): void {
  localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(loans))
}

function sortByDate(loans: Loan[]): Loan[] {
  return [...loans].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function useLoans(userEmail?: string) {
  const [loans, setLoans] = useState<Loan[]>(() => {
    if (userEmail) {
      return sortByDate(loadLoans().filter((l) => l.userEmail === userEmail))
    }
    return sortByDate(loadLoans())
  })

  const refreshLoans = (filter?: LoanStatus | 'ALL') => {
    const allLoans = loadLoans()

    if (userEmail) {
      setLoans(sortByDate(allLoans.filter((l) => l.userEmail === userEmail)))
      return
    }

    if (!filter || filter === 'ALL') {
      setLoans(sortByDate(allLoans))
    } else {
      setLoans(sortByDate(allLoans.filter((l) => l.status === filter)))
    }
  }

  const createLoan = (request: LoanRequest): Loan => {
    const allLoans = loadLoans()
    const now = new Date().toISOString()

    const newLoan: Loan = {
      id: generateId(),
      userEmail: userEmail!,
      amount: request.amount,
      term: request.term,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    }

    allLoans.push(newLoan)
    saveLoans(allLoans)
    refreshLoans()
    return newLoan
  }

  const updateLoanStatus = (loanId: string, status: LoanStatus): void => {
    const allLoans = loadLoans()
    const index = allLoans.findIndex((l) => l.id === loanId)

    if (index === -1) return

    allLoans[index] = {
      ...allLoans[index],
      status,
      updatedAt: new Date().toISOString(),
    }

    saveLoans(allLoans)
  }

  const getStats = () => {
    const allLoans = loadLoans()
    return {
      total: allLoans.length,
      pending: allLoans.filter((l) => l.status === 'PENDING').length,
      approved: allLoans.filter((l) => l.status === 'APPROVED').length,
      rejected: allLoans.filter((l) => l.status === 'REJECTED').length,
    }
  }

  return { loans, createLoan, updateLoanStatus, refreshLoans, getStats }
}
