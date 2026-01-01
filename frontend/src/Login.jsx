import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // local validation
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    // simulate async login
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Sign in is a no-op in this demo — implement auth later.')
    }, 700)
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

            <div className="separator">Or continue with</div>
            <div className="socials">
              <button className="btn social" aria-label="Sign in with GitHub">GitHub</button>
              <button className="btn social" aria-label="Sign in with Google">Google</button>
            </div>

            <div className="signup muted">New here? <a href="#" onClick={(e) => e.preventDefault()}>Create an account</a></div>
          </form>

          <div className="footnote muted">Version 0.1.0</div>
        </div>
      </div>
    </div>
  )
}
