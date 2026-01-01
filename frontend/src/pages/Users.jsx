import React, { useEffect, useState } from 'react'

export default function Users({ token }) {
  const [users, setUsers] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [error, setError] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!token) return
    setLoading(true)
    Promise.all([
      fetch(apiBase + '/users', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(apiBase + '/schools', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ])
      .then(([usersRes, schoolsRes]) => {
        setUsers(Array.isArray(usersRes) ? usersRes : [])
        setSchools(Array.isArray(schoolsRes) ? schoolsRes : [])
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [token])

  const handleInvite = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const body = { email }
      if (school) body.school = school
      const r = await fetch(apiBase + '/users', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setUsers([d, ...users])
      setEmail('')
      setSchool('')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  if (loading) return <div className="login-right"><p>Loading...</p></div>

  return (
    <div className="login-right">
      <h2>Users</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleInvite} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select value={school} onChange={(e) => setSchool(e.target.value)}>
            <option value="">-- select school (optional) --</option>
            {schools.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
          <button className="btn" type="submit">Invite</button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6 }}>Email</th>
            <th style={{ textAlign: 'left', padding: 6 }}>School</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Invited</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Accepted</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td style={{ padding: 6 }}>{u.email}</td>
              <td style={{ padding: 6 }}>{u.school ? (typeof u.school === 'object' ? u.school.name : u.school) : '-'}</td>
              <td style={{ padding: 6 }}>{u.invitedAt ? new Date(u.invitedAt).toLocaleString() : '-'}</td>
              <td style={{ padding: 6 }}>{u.acceptedAt ? new Date(u.acceptedAt).toLocaleString() : '-'}</td>
              <td style={{ padding: 6 }}>
                {!u.acceptedAt && <button className="btn btn-small" onClick={async () => { const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/users/${u._id}/accept`, { method: 'POST' }); if (r.ok) { const d = await r.json(); setUsers(users.map(x => x._id === u._id ? d : x)); } }}>Accept</button>}
                <button className="btn btn-small" onClick={async () => { if (!confirm('Delete this user?')) return; const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/users/${u._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (r.ok) setUsers(users.filter(x => x._id !== u._id)); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
