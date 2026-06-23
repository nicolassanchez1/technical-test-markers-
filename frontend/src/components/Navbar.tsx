import type { AuthUser } from '../types'

type Props = {
  user: AuthUser
  onLogout: () => void
}

export function Navbar({ user, onLogout }: Props) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">MB</span>
        <span className="navbar-title">Makers Bank</span>
      </div>

      <div className="navbar-user">
        <span className="navbar-role">
          {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
        </span>
        <span className="navbar-name">{user.name}</span>
        <button className="navbar-logout" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>
    </header>
  )
}
