import type { LoginForm, LoanRequest } from '../types'
import { LOAN_LIMITS, TEXTS } from '../constants'

type LoginErrors = Partial<Record<keyof LoginForm | 'credentials', string>>
type LoanErrors = Partial<Record<keyof LoanRequest, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {}

  if (!form.email.trim()) {
    errors.email = TEXTS.validation.emailRequired
  } else if (!EMAIL_PATTERN.test(form.email)) {
    errors.email = TEXTS.validation.emailInvalid
  }

  if (!form.password) {
    errors.password = TEXTS.validation.passwordRequired
  }

  return errors
}

export function validateLoanForm(form: LoanRequest): LoanErrors {
  const errors: LoanErrors = {}

  if (!form.amount || form.amount <= 0) {
    errors.amount = TEXTS.validation.amountRequired
  } else if (form.amount > LOAN_LIMITS.MAX_AMOUNT) {
    errors.amount = TEXTS.validation.amountMax
  }

  return errors
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.keys(errors).length > 0
}
