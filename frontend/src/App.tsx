import { useState } from 'react'
import type { AuthUser } from './types'
import { getSession, login, logout } from './services/auth'
import { Login } from './components/Login'
import { Navbar } from './components/Navbar'
import { UserDashboard } from './components/UserDashboard'
import { AdminDashboard } from './components/AdminDashboard'
import './App.css'

function App() {
  const [session, setSession] = useState<AuthUser | null>(getSession())

  const handleLogin = (email: string, password: string): boolean => {
    const user = login(email, password)
    if (!user) return false
    setSession(user)
    return true
  }

  const handleLogout = () => {
    logout()
    setSession(null)
  }

  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <>
      <Navbar user={session} onLogout={handleLogout} />
      {session.role === 'ADMIN' ? (
        <AdminDashboard user={session} />
      ) : (
        <UserDashboard user={session} />
      )}
    </>
  )
}

export default App
