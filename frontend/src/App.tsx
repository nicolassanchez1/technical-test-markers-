import { Login } from './components/Login'
import { Navbar } from './components/Navbar'
import { UserDashboard } from './components/UserDashboard'
import { AdminDashboard } from './components/AdminDashboard'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const { session, login, logout, isLoading, error, clearError } = useAuth()

  if (!session) {
    return (
      <Login
        onLogin={login}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
      />
    )
  }

  return (
    <>
      <Navbar user={session} onLogout={logout} />
      {session.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard user={session} />}
    </>
  )
}

export default App
