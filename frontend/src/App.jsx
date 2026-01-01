import React, { useEffect, useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLogin = (token) => {
    localStorage.setItem('token', token)
    setToken(token)
  }
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  useEffect(() => {
    // no-op; dashboard will validate token with API
  }, [token])

  return (
    <div style={{ padding: 20 }}>
      {!token ? <Login onLogin={handleLogin} /> : <Dashboard token={token} onLogout={handleLogout} />}
    </div>
  )
}
