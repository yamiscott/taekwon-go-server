import React, { useEffect, useState } from 'react'

import Admins from './pages/Admins'
import Users from './pages/Users'
import Schools from './pages/Schools'

export default function Dashboard({ token, onLogout }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('home')

  const getInitialPage = () => {
    const p = window.location.pathname || '/'
    if (p === '/admins') return 'admins'
    if (p === '/users') return 'users'
    if (p === '/schools') return 'schools'
    return 'home'
  }

  useEffect(() => {
    setPage(getInitialPage())
    const onPop = () => setPage(getInitialPage())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!token) return
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/cms/auth/me', {
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

  const navigate = (target) => {
    const path = target === 'home' ? '/' : `/${target}`
    if (window.location.pathname !== path) history.pushState({}, '', path)
    setPage(target)
  }

  if (loading) return <div className="login-right"><p>Loading...</p></div>
  if (!admin) return <div className="login-right"><p>Unauthorized</p></div>

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 220 }}>
        <div className="card sidebar">
          <h3 style={{ marginTop: 0 }}>Menu</h3>
          <ul className="menu">
            <li className="menu-item"><a href="/" className={`menu-link ${page === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('home') }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11.5L12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>Overview</a></li>
            <li className="menu-item"><a href="/admins" className={`menu-link ${page === 'admins' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('admins') }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 21v-1a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v1"/></svg>Admins</a></li>
            <li className="menu-item"><a href="/users" className={`menu-link ${page === 'users' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('users') }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM6 11c1.657 0 3-1.567 3-3.5S7.657 4 6 4 3 5.567 3 7.5 4.343 11 6 11zM16 14v1a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-1"/></svg>Users</a></li>
            <li className="menu-item"><a href="/schools" className={`menu-link ${page === 'schools' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('schools') }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7l9-4 9 4v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V7z"/></svg>Schools</a></li>
            <li className="menu-item"><a href="/" className="menu-link signout" onClick={(e) => { e.preventDefault(); navigate('home'); onLogout(); }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 17l5-5-5-5M21 12H9"/></svg>Sign out</a></li>
          </ul>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {page === 'home' && (
          <div className="login-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Welcome, {admin.email}</h2>
                <p className="muted">Role: <strong style={{ textTransform: 'capitalize' }}>{admin.role}</strong></p>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>Dashboard</h3>
              <p className="muted">This is a protected area — API validated the JWT.</p>
            </div>
          </div>
        )}

        {page === 'admins' && <Admins token={token} />}

        {page === 'users' && <Users token={token} />}

        {page === 'schools' && <Schools token={token} />}
      </div>
    </div>
  )
}
