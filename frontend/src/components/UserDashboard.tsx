import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthUser, Loan, LoanRequest } from '../types'
import { createLoan, getLoansByUser } from '../services/loans'

type Props = {
  user: AuthUser
}

type FormErrors = Partial<Record<keyof LoanRequest, string>>

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  PENDING: { text: 'Pendiente', className: 'status-pending' },
  APPROVED: { text: 'Aprobado', className: 'status-approved' },
  REJECTED: { text: 'Rechazado', className: 'status-rejected' },
}

export function UserDashboard({ user }: Props) {
  const [loans, setLoans] = useState<Loan[]>(() => getLoansByUser(user.email))
  const [form, setForm] = useState<LoanRequest>({ amount: 0, term: 1 })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validate = (): FormErrors => {
    const errs: FormErrors = {}

    if (!form.amount || form.amount <= 0) {
      errs.amount = 'El monto debe ser mayor a 0.'
    } else if (form.amount > 1000000) {
      errs.amount = 'El monto maximo es $1,000,000.'
    }

    if (!form.term || form.term < 1) {
      errs.term = 'El plazo minimo es 1 mes.'
    } else if (form.term > 60) {
      errs.term = 'El plazo maximo es 60 meses.'
    }

    return errs
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    createLoan(user.email, form)
    setLoans(getLoansByUser(user.email))
    setForm({ amount: 0, term: 1 })
    setErrors({})
    setShowForm(false)
    setSuccessMessage('Solicitud de prestamo enviada correctamente.')
    setTimeout(() => setSuccessMessage(''), 4000)
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
    })

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Mis prestamos</h1>
          <p>Solicita y consulta el estado de tus prestamos.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setErrors({})
          }}
        >
          {showForm ? 'Cancelar' : 'Nuevo prestamo'}
        </button>
      </div>

      {successMessage && <div className="alert-success">{successMessage}</div>}

      {showForm && (
        <section className="loan-form-card">
          <h2>Solicitar prestamo</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="amount">Monto (MXN)</label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  max="1000000"
                  placeholder="10000"
                  value={form.amount || ''}
                  aria-invalid={Boolean(errors.amount)}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                    setErrors((prev) => ({ ...prev, amount: undefined }))
                  }}
                />
                {errors.amount && <span className="field-error">{errors.amount}</span>}
              </div>

              <div className="field">
                <label htmlFor="term">Plazo (meses)</label>
                <input
                  id="term"
                  type="number"
                  min="1"
                  max="60"
                  placeholder="12"
                  value={form.term || ''}
                  aria-invalid={Boolean(errors.term)}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, term: Number(e.target.value) }))
                    setErrors((prev) => ({ ...prev, term: undefined }))
                  }}
                />
                {errors.term && <span className="field-error">{errors.term}</span>}
              </div>
            </div>

            <button className="btn-primary" type="submit">
              Enviar solicitud
            </button>
          </form>
        </section>
      )}

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>No tienes prestamos registrados.</p>
          <p>Solicita tu primer prestamo para comenzar.</p>
        </div>
      ) : (
        <section className="loans-grid">
          {loans.map((loan) => {
            const statusInfo = STATUS_LABELS[loan.status]
            return (
              <article key={loan.id} className="loan-card">
                <div className="loan-card-header">
                  <span className="loan-id">#{loan.id.slice(0, 8)}</span>
                  <span className={`status-badge ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>

                <div className="loan-card-body">
                  <div className="loan-detail">
                    <span className="loan-label">Monto</span>
                    <span className="loan-value">{formatCurrency(loan.amount)}</span>
                  </div>
                  <div className="loan-detail">
                    <span className="loan-label">Plazo</span>
                    <span className="loan-value">{loan.term} meses</span>
                  </div>
                </div>

                <div className="loan-card-footer">
                  <span>Solicitado: {formatDate(loan.createdAt)}</span>
                  <span>Actualizado: {formatDate(loan.updatedAt)}</span>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
