import type { AuthUser } from '../types'
import { APP_NAME, ROLE_LABELS, TEXTS } from '../constants'

type Props = {
  user: AuthUser
  onLogout: () => void
}

export function Navbar({ user, onLogout }: Props) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">{APP_NAME.slice(0, 2)}</span>
        <span className="navbar-title">{APP_NAME}</span>
      </div>

      <div className="navbar-user">
        <span className="navbar-role">
          {ROLE_LABELS[user.role] ?? user.role}
        </span>
        <span className="navbar-name">{user.name}</span>
        <button className="navbar-logout" onClick={onLogout}>
          {TEXTS.navbar.logoutBtn}
        </button>
      </div>
    </header>
  )
}
