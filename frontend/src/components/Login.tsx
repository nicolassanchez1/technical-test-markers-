import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginForm } from '../types'

type Props = {
  onLogin: (email: string, password: string) => boolean
}

type LoginErrors = Partial<Record<keyof LoginForm | 'credentials', string>>

export function Login({ onLogin }: Props) {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})

  const validate = (): LoginErrors => {
    const errs: LoginErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.email.trim()) {
      errs.email = 'El correo es obligatorio.'
    } else if (!emailPattern.test(form.email)) {
      errs.email = 'Ingresa un correo valido.'
    }

    if (!form.password) {
      errs.password = 'La contrasena es obligatoria.'
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

    const success = onLogin(form.email, form.password)
    if (!success) {
      setErrors({ credentials: 'Correo o contrasena incorrectos.' })
    }
  }

  const clearFieldError = (field: keyof LoginForm) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, credentials: undefined }))
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-hero-content">
          <span className="eyebrow">Makers Bank</span>
          <h1>Gestion de prestamos bancarios</h1>
          <p>
            Sistema integral para la solicitud, seguimiento y aprobacion de
            prestamos bancarios.
          </p>
          <div className="demo-credentials">
            <div className="credential-chip">
              <strong>Usuario:</strong> usuario@test.com / 123
            </div>
            <div className="credential-chip">
              <strong>Admin:</strong> admin@test.com / 123
            </div>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form-header">
            <span className="eyebrow">Acceso seguro</span>
            <h2>Iniciar sesion</h2>
            <p>Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              autoComplete="email"
              placeholder="usuario@test.com"
              aria-invalid={Boolean(errors.email)}
              onChange={(e) => {
                setForm((f) => ({ ...f, email: e.target.value }))
                clearFieldError('email')
              }}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              value={form.password}
              autoComplete="current-password"
              placeholder="123"
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
            Ingresar
          </button>
        </form>
      </section>
    </main>
  )
}
