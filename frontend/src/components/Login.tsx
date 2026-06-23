import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginForm } from '../types'
import { APP_NAME, MOCK_USERS, TEXTS } from '../constants'
import { validateLoginForm, hasErrors } from '../utils/validation'

type Props = {
  onLogin: (email: string, password: string) => boolean
}

type LoginErrors = Partial<Record<keyof LoginForm | 'credentials', string>>

const INITIAL_FORM: LoginForm = { email: '', password: '' }

export function Login({ onLogin }: Props) {
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<LoginErrors>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateLoginForm(form)

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    const success = onLogin(form.email, form.password)
    if (!success) {
      setErrors({ credentials: TEXTS.validation.credentialsInvalid })
    }
  }

  const clearFieldError = (field: keyof LoginForm) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, credentials: undefined }))
  }

  const demoUser = MOCK_USERS[0]
  const demoAdmin = MOCK_USERS[1]

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-hero-content">
          <span className="eyebrow">{APP_NAME}</span>
          <h1>{TEXTS.login.heroTitle}</h1>
          <p>{TEXTS.login.heroSubtitle}</p>
          <div className="demo-credentials">
            <div className="credential-chip">
              <strong>{TEXTS.login.demoUserLabel}:</strong> {demoUser.email} / {demoUser.password}
            </div>
            <div className="credential-chip">
              <strong>{TEXTS.login.demoAdminLabel}:</strong> {demoAdmin.email} / {demoAdmin.password}
            </div>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form-header">
            <span className="eyebrow">{TEXTS.login.eyebrow}</span>
            <h2>{TEXTS.login.title}</h2>
            <p>{TEXTS.login.subtitle}</p>
          </div>

          <div className="field">
            <label htmlFor="email">{TEXTS.login.emailLabel}</label>
            <input
              id="email"
              type="email"
              value={form.email}
              autoComplete="email"
              placeholder={demoUser.email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) => {
                setForm((f) => ({ ...f, email: e.target.value }))
                clearFieldError('email')
              }}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">{TEXTS.login.passwordLabel}</label>
            <input
              id="password"
              type="password"
              value={form.password}
              autoComplete="current-password"
              placeholder={demoUser.password}
              aria-invalid={Boolean(errors.password)}
              onChange={(e) => {
                setForm((f) => ({ ...f, password: e.target.value }))
                clearFieldError('password')
              }}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {errors.credentials && (
            <div className="alert-error">{errors.credentials}</div>
          )}

          <button className="btn-primary" type="submit">
            {TEXTS.login.submitBtn}
          </button>
        </form>
      </section>
    </main>
  )
}
