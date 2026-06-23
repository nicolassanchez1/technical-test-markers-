const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const DATETIME_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value)
}

export function formatDate(dateStr: string): string {
  return DATE_FORMATTER.format(new Date(dateStr))
}

export function formatDateTime(dateStr: string): string {
  return DATETIME_FORMATTER.format(new Date(dateStr))
}

export function formatLoanId(id: string): string {
  return `#${id.slice(0, 8)}`
}
