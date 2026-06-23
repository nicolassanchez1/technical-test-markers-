import { useEffect, useState } from 'react'
import type { LoanStatus } from '../types'
import { FILTER_LABELS, FILTER_OPTIONS, STATUS_LABELS, TEXTS } from '../constants'
import { useLoans } from '../hooks/useLoans'
import { formatCurrency, formatDateTime, formatLoanId } from '../utils/format'

type FilterType = (typeof FILTER_OPTIONS)[number]

export function AdminDashboard() {
  const { loans, isLoading, error, fetchAllLoans, updateLoanStatus, getStats, clearError } =
    useLoans()
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    fetchAllLoans()
  }, [fetchAllLoans])

  const stats = getStats()

  const filteredLoans =
    filter === 'ALL' ? loans : loans.filter((l) => l.status === filter)

  const handleStatusChange = async (loanId: number, newStatus: LoanStatus) => {
    setProcessingId(loanId)
    await updateLoanStatus(loanId, newStatus)
    setProcessingId(null)
  }

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    clearError()
  }

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{TEXTS.adminDashboard.title}</h1>
          <p>{TEXTS.adminDashboard.subtitle}</p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">{TEXTS.adminDashboard.totalLabel}</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">{TEXTS.adminDashboard.pendingLabel}</span>
        </div>
        <div className="stat-card stat-approved">
          <span className="stat-number">{stats.approved}</span>
          <span className="stat-label">{TEXTS.adminDashboard.approvedLabel}</span>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-number">{stats.rejected}</span>
          <span className="stat-label">{TEXTS.adminDashboard.rejectedLabel}</span>
        </div>
      </section>

      <section className="filter-bar">
        <span className="filter-label">{TEXTS.adminDashboard.filterLabel}</span>
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => handleFilterChange(f)}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </section>

      {error && <div className="alert-error">{error}</div>}

      {isLoading && loans.length === 0 ? (
        <div className="empty-state">
          <p>Cargando prestamos...</p>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="empty-state">
          <p>
            {TEXTS.adminDashboard.emptyMessage}{' '}
            {filter !== 'ALL'
              ? TEXTS.adminDashboard.emptyWithFilter
              : TEXTS.adminDashboard.emptyDefault}
            .
          </p>
        </div>
      ) : (
        <section className="admin-loans-list">
          {filteredLoans.map((loan) => {
            const statusInfo = STATUS_LABELS[loan.status]
            const isProcessing = processingId === loan.id

            return (
              <article key={loan.id} className="admin-loan-card">
                <div className="admin-loan-info">
                  <div className="admin-loan-header">
                    <span className="loan-id">{formatLoanId(String(loan.id))}</span>
                    <span className={`status-badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="admin-loan-details">
                    <span>
                      <strong>{TEXTS.adminDashboard.applicantLabel}:</strong> {loan.userEmail}
                    </span>
                    <span>
                      <strong>{TEXTS.adminDashboard.amountLabel}:</strong> {formatCurrency(loan.amount)}
                    </span>
                    <span>
                      <strong>{TEXTS.adminDashboard.dateLabel}:</strong> {formatDateTime(loan.createdAt)}
                    </span>
                  </div>
                </div>

                {loan.status === 'PENDING' && (
                  <div className="admin-actions">
                    <button
                      className="btn-approve"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(loan.id, 'APPROVED')}
                    >
                      {isProcessing
                        ? TEXTS.adminDashboard.processingBtn
                        : TEXTS.adminDashboard.approveBtn}
                    </button>
                    <button
                      className="btn-reject"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(loan.id, 'REJECTED')}
                    >
                      {isProcessing
                        ? TEXTS.adminDashboard.processingBtn
                        : TEXTS.adminDashboard.rejectBtn}
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
