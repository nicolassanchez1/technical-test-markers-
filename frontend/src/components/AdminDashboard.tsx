import { useState } from 'react'
import type { AuthUser, Loan, LoanStatus } from '../types'
import {
  getAllLoans,
  getLoanStats,
  getPendingLoans,
  updateLoanStatus,
} from '../services/loans'

type Props = {
  user: AuthUser
}

type FilterType = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  PENDING: { text: 'Pendiente', className: 'status-pending' },
  APPROVED: { text: 'Aprobado', className: 'status-approved' },
  REJECTED: { text: 'Rechazado', className: 'status-rejected' },
}

export function AdminDashboard({ user: _user }: Props) {
  const [filter, setFilter] = useState<FilterType>('PENDING')
  const [loans, setLoans] = useState<Loan[]>(getPendingLoans())
  const [stats, setStats] = useState(getLoanStats())
  const [processingId, setProcessingId] = useState<string | null>(null)

  const refreshData = (newFilter: FilterType) => {
    setFilter(newFilter)
    switch (newFilter) {
      case 'ALL':
        setLoans(getAllLoans())
        break
      case 'PENDING':
        setLoans(getPendingLoans())
        break
      default:
        setLoans(getAllLoans().filter((l) => l.status === newFilter))
    }
    setStats(getLoanStats())
  }

  const handleStatusChange = (loanId: string, newStatus: LoanStatus) => {
    setProcessingId(loanId)
    setTimeout(() => {
      updateLoanStatus(loanId, newStatus)
      refreshData(filter)
      setProcessingId(null)
    }, 300)
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel de administracion</h1>
          <p>Gestiona las solicitudes de prestamos bancarios.</p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card stat-approved">
          <span className="stat-number">{stats.approved}</span>
          <span className="stat-label">Aprobados</span>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-number">{stats.rejected}</span>
          <span className="stat-label">Rechazados</span>
        </div>
      </section>

      <section className="filter-bar">
        <span className="filter-label">Filtrar:</span>
        {(['PENDING', 'ALL', 'APPROVED', 'REJECTED'] as FilterType[]).map(
          (f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => refreshData(f)}
            >
              {f === 'ALL'
                ? 'Todos'
                : f === 'PENDING'
                  ? 'Pendientes'
                  : f === 'APPROVED'
                    ? 'Aprobados'
                    : 'Rechazados'}
            </button>
          ),
        )}
      </section>

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>No hay prestamos {filter !== 'ALL' ? 'con este filtro' : 'registrados'}.</p>
        </div>
      ) : (
        <section className="admin-loans-list">
          {loans.map((loan) => {
            const statusInfo = STATUS_LABELS[loan.status]
            const isProcessing = processingId === loan.id

            return (
              <article key={loan.id} className="admin-loan-card">
                <div className="admin-loan-info">
                  <div className="admin-loan-header">
                    <span className="loan-id">#{loan.id.slice(0, 8)}</span>
                    <span className={`status-badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="admin-loan-details">
                    <span>
                      <strong>Solicitante:</strong> {loan.userEmail}
                    </span>
                    <span>
                      <strong>Monto:</strong> {formatCurrency(loan.amount)}
                    </span>
                    <span>
                      <strong>Plazo:</strong> {loan.term} meses
                    </span>
                    <span>
                      <strong>Fecha:</strong> {formatDate(loan.createdAt)}
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
                      {isProcessing ? 'Procesando...' : 'Aprobar'}
                    </button>
                    <button
                      className="btn-reject"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(loan.id, 'REJECTED')}
                    >
                      {isProcessing ? 'Procesando...' : 'Rechazar'}
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
