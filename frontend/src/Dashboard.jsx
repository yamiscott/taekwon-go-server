import React, { useEffect, useState } from 'react'

export default function Dashboard({ token, onLogout }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized')
        return r.json()
      })
      .then((d) => setAdmin(d.admin))
      .catch(() => onLogout())
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className="login-right"><p>Loading...</p></div>
  if (!admin) return <div className="login-right"><p>Unauthorized</p></div>

  return (
    <div className="login-right">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Welcome, {admin.email}</h2>
          <p className="muted">You are signed in as an admin.</p>
        </div>
        <div>
          <button className="btn" onClick={() => onLogout()}>Sign out</button>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Dashboard</h3>
        <p className="muted">This is a protected area — API validated the JWT.</p>
      </div>
    </div>
  )
}
