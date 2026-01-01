import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // local validation
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data && data.error ? data.error : 'Login failed')
        setLoading(false)
        return
      }
      const token = data.token
      if (onLogin) onLogin(token)
      setLoading(false)
    } catch (err) {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card" role="region" aria-label="login form">
        <div className="login-left" aria-hidden>
          <div className="logo-big">🥋</div>
          <h1>Taekwon-go CMS</h1>
          <p className="left-tag">Manage content, pages and media with confidence</p>
        </div>

        <div className="login-right">
          <div className="brand-compact">
            <div className="logo">🥋</div>
            <div>
              <h2>Welcome back</h2>
              <p className="muted">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {error && <div className="error">{error}</div>}

            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" aria-label="email" />

            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" aria-label="password" />

            <div className="row between">
              <label className="checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="muted">Forgot?</a>
            </div>

            <button className="btn primary" type="submit" disabled={loading} aria-busy={loading}>
              {loading ? <span className="spinner" aria-hidden /> : 'Sign in'}
            </button>

            <div className="signup muted">New here? <a href="#" onClick={(e) => e.preventDefault()}>Create an account</a></div>
          </form>

          <div className="footnote muted">Version 0.1.0</div>
        </div>
      </div>
    </div>
  )
}
