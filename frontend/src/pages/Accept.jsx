import React, { useState, useEffect } from 'react';

export default function Accept() {
  const [step, setStep] = useState('validating'); // validating | set-password | done | error
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    setToken(t);
    if (!t) {
      setError('No invite token provided.');
      setStep('error');
      return;
    }
    // Validate token
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/auth/validate-invite?token=' + t)
      .then(r => r.json())
      .then(d => {
        if (d && d.email) {
          setEmail(d.email);
          setStep('set-password');
        } else {
          setError(d.error || 'Invalid or expired invite token.');
          setStep('error');
        }
      })
      .catch(() => {
        setError('Network error.');
        setStep('error');
      });
  }, []);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/auth/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      let d;
      try {
        d = await r.json();
      } catch (jsonErr) {
        // If not JSON, treat as generic error
        throw new Error('Unexpected server response. Please try again or contact support.');
      }
      if (!r.ok) throw new Error(d.error || 'Failed');
      setStep('done');
    } catch (err) {
      setError(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (step === 'validating') return <div style={{ maxWidth: 400, margin: '60px auto' }}><h2>Validating invite...</h2></div>;
  if (step === 'error') return <div style={{ maxWidth: 400, margin: '60px auto' }}><h2>Invite Error</h2><p>{error}</p></div>;
  if (step === 'done') return <div style={{ maxWidth: 400, margin: '60px auto' }}><h2>Account Created!</h2><p>Your password has been set. You can now install and use the Pocket TKD app.</p><p><a href="https://play.google.com/store/apps/details?id=com.pockettkd">Get the app on Google Play</a></p></div>;

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h2>Accept Invite</h2>
      <p>Email: <strong>{email}</strong></p>
      <form onSubmit={handleSetPassword}>
        <label style={{ display: 'block', marginBottom: 8 }}>Set your password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }} />
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button className="btn primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Set Password'}</button>
      </form>
    </div>
  );
}
