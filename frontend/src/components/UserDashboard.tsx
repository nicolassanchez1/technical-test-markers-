import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthUser, LoanRequest } from '../types'
import { STATUS_LABELS, TEXTS } from '../constants'
import { useLoans } from '../hooks/useLoans'
import { validateLoanForm, hasErrors } from '../utils/validation'
import { formatCurrency, formatDate, formatLoanId } from '../utils/format'

type Props = {
  user: AuthUser
}

type FormErrors = Partial<Record<keyof LoanRequest, string>>

const INITIAL_FORM: LoanRequest = { amount: 0, term: 1 }

export function UserDashboard({ user }: Props) {
  const { loans, createLoan } = useLoans(user.email)
  const [form, setForm] = useState<LoanRequest>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateLoanForm(form)

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    createLoan(form)
    setForm(INITIAL_FORM)
    setErrors({})
    setShowForm(false)
    setSuccessMessage(TEXTS.userDashboard.successMessage)
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  const toggleForm = () => {
    setShowForm((prev) => !prev)
    setErrors({})
  }

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{TEXTS.userDashboard.title}</h1>
          <p>{TEXTS.userDashboard.subtitle}</p>
        </div>
        <button className="btn-primary" onClick={toggleForm}>
          {showForm ? TEXTS.userDashboard.cancelBtn : TEXTS.userDashboard.newLoanBtn}
        </button>
      </div>

      {successMessage && <div className="alert-success">{successMessage}</div>}

      {showForm && (
        <section className="loan-form-card">
          <h2>{TEXTS.userDashboard.formTitle}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="amount">{TEXTS.userDashboard.amountLabel}</label>
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
                <label htmlFor="term">{TEXTS.userDashboard.termLabel}</label>
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
              {TEXTS.userDashboard.submitBtn}
            </button>
          </form>
        </section>
      )}

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>{TEXTS.userDashboard.emptyTitle}</p>
          <p>{TEXTS.userDashboard.emptySubtitle}</p>
        </div>
      ) : (
        <section className="loans-grid">
          {loans.map((loan) => {
            const statusInfo = STATUS_LABELS[loan.status]
            return (
              <article key={loan.id} className="loan-card">
                <div className="loan-card-header">
                  <span className="loan-id">{formatLoanId(loan.id)}</span>
                  <span className={`status-badge ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>

                <div className="loan-card-body">
                  <div className="loan-detail">
                    <span className="loan-label">{TEXTS.common.amountLabel}</span>
                    <span className="loan-value">{formatCurrency(loan.amount)}</span>
                  </div>
                  <div className="loan-detail">
                    <span className="loan-label">{TEXTS.common.termLabel}</span>
                    <span className="loan-value">{loan.term} {TEXTS.common.monthsUnit}</span>
                  </div>
                </div>

                <div className="loan-card-footer">
                  <span>{TEXTS.common.requestedPrefix} {formatDate(loan.createdAt)}</span>
                  <span>{TEXTS.common.updatedPrefix} {formatDate(loan.updatedAt)}</span>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
