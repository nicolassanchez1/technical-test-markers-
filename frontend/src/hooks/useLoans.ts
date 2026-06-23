import { useState, useCallback } from 'react'
import type { Loan, LoanRequest, LoanStatus, LoanStatusUpdate, ApiError } from '../types'
import { api } from '../services/api'

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserLoans = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await api.get<Loan[]>('/loans')
      setLoans(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Error al cargar prestamos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAllLoans = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await api.get<Loan[]>('/loans/all')
      setLoans(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Error al cargar prestamos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createLoan = async (request: LoanRequest): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await api.post<Loan>('/loans', request)
      await fetchUserLoans()
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Error al solicitar prestamo.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateLoanStatus = async (
    loanId: number,
    status: LoanStatus,
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const body: LoanStatusUpdate = { status: status as 'APPROVED' | 'REJECTED' }
      await api.patch<Loan>(`/loans/${loanId}/status`, body)
      await fetchAllLoans()
      return true
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Error al actualizar prestamo.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  const getStats = () => ({
    total: loans.length,
    pending: loans.filter((l) => l.status === 'PENDING').length,
    approved: loans.filter((l) => l.status === 'APPROVED').length,
    rejected: loans.filter((l) => l.status === 'REJECTED').length,
  })

  return {
    loans,
    isLoading,
    error,
    fetchUserLoans,
    fetchAllLoans,
    createLoan,
    updateLoanStatus,
    clearError,
    getStats,
  }
}
