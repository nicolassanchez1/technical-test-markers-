export const APP_NAME = 'Makers Bank'

export const AUTH_STORAGE_KEY = 'makers-bank-auth'
export const LOANS_STORAGE_KEY = 'makers-bank-loans'

export const MOCK_USERS = [
  {
    email: 'usuario@test.com',
    password: '123',
    name: 'Usuario Demo',
    role: 'USER' as const,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-user-token',
  },
  {
    email: 'admin@test.com',
    password: '123',
    name: 'Admin Demo',
    role: 'ADMIN' as const,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-admin-token',
  },
]

export const LOAN_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 1_000_000,
  MIN_TERM: 1,
  MAX_TERM: 60,
} as const

export const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  PENDING: { text: 'Pendiente', className: 'status-pending' },
  APPROVED: { text: 'Aprobado', className: 'status-approved' },
  REJECTED: { text: 'Rechazado', className: 'status-rejected' },
}

export const FILTER_OPTIONS = ['PENDING', 'ALL', 'APPROVED', 'REJECTED'] as const

export const FILTER_LABELS: Record<string, string> = {
  ALL: 'Todos',
  PENDING: 'Pendientes',
  APPROVED: 'Aprobados',
  REJECTED: 'Rechazados',
}

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuario',
}

export const TEXTS = {
  login: {
    eyebrow: 'Acceso seguro',
    title: 'Iniciar sesion',
    subtitle: 'Ingresa tus credenciales para acceder al sistema.',
    emailLabel: 'Email',
    passwordLabel: 'Contrasena',
    submitBtn: 'Ingresar',
    heroTitle: 'Gestion de prestamos bancarios',
    heroSubtitle: 'Sistema integral para la solicitud, seguimiento y aprobacion de prestamos bancarios.',
    demoUserLabel: 'Usuario',
    demoAdminLabel: 'Admin',
  },
  navbar: {
    logoutBtn: 'Cerrar sesion',
  },
  userDashboard: {
    title: 'Mis prestamos',
    subtitle: 'Solicita y consulta el estado de tus prestamos.',
    newLoanBtn: 'Nuevo prestamo',
    cancelBtn: 'Cancelar',
    formTitle: 'Solicitar prestamo',
    amountLabel: 'Monto (MXN)',
    termLabel: 'Plazo (meses)',
    submitBtn: 'Enviar solicitud',
    successMessage: 'Solicitud de prestamo enviada correctamente.',
    emptyTitle: 'No tienes prestamos registrados.',
    emptySubtitle: 'Solicita tu primer prestamo para comenzar.',
  },
  adminDashboard: {
    title: 'Panel de administracion',
    subtitle: 'Gestiona las solicitudes de prestamos bancarios.',
    filterLabel: 'Filtrar:',
    approveBtn: 'Aprobar',
    rejectBtn: 'Rechazar',
    processingBtn: 'Procesando...',
    emptyMessage: 'No hay prestamos',
    emptyWithFilter: 'con este filtro',
    emptyDefault: 'registrados',
    totalLabel: 'Total',
    pendingLabel: 'Pendientes',
    approvedLabel: 'Aprobados',
    rejectedLabel: 'Rechazados',
    applicantLabel: 'Solicitante',
    amountLabel: 'Monto',
    termLabel: 'Plazo',
    dateLabel: 'Fecha',
  },
  validation: {
    emailRequired: 'El correo es obligatorio.',
    emailInvalid: 'Ingresa un correo valido.',
    passwordRequired: 'La contrasena es obligatoria.',
    credentialsInvalid: 'Correo o contrasena incorrectos.',
    amountRequired: 'El monto debe ser mayor a 0.',
    amountMax: 'El monto maximo es $1,000,000.',
    termMin: 'El plazo minimo es 1 mes.',
    termMax: 'El plazo maximo es 60 meses.',
  },
  common: {
    amountLabel: 'Monto',
    termLabel: 'Plazo',
    monthsUnit: 'meses',
    requestedPrefix: 'Solicitado:',
    updatedPrefix: 'Actualizado:',
  },
} as const
