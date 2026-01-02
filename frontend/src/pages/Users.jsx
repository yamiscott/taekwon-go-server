
import React, { useEffect, useState } from 'react'
import UserDetails from './UserDetails'

export default function Users({ token, admin }) {
  const [users, setUsers] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [school, setSchool] = useState('')
  const [error, setError] = useState(null)
  const [resetUserId, setResetUserId] = useState(null)
  const [resetPassword, setResetPassword] = useState('')
  const [resetError, setResetError] = useState(null)
  const [manageUserId, setManageUserId] = useState(null);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const isSchoolAdmin = admin?.role === 'school'

  useEffect(() => {
    if (!token) return
    setLoading(true)
    Promise.all([
      fetch(apiBase + '/cms/users', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(apiBase + '/cms/schools', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ])
      .then(([usersRes, schoolsRes]) => {
        setUsers(Array.isArray(usersRes) ? usersRes : [])
        setSchools(Array.isArray(schoolsRes) ? schoolsRes : [])
        // Auto-select school for school admins
        if (isSchoolAdmin && admin.school) {
          const schoolId = typeof admin.school === 'object' ? admin.school._id : admin.school
          setSchool(schoolId)
        }
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [token, apiBase, admin])

  const reloadUsers = () => {
    setLoading(true)
    Promise.all([
      fetch(apiBase + '/cms/users', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(apiBase + '/cms/schools', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ])
      .then(([usersRes, schoolsRes]) => {
        setUsers(Array.isArray(usersRes) ? usersRes : [])
        setSchools(Array.isArray(schoolsRes) ? schoolsRes : [])
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const body = { email }
      if (school) body.school = school
      const r = await fetch(apiBase + '/cms/users', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setUsers([d, ...users])
      setEmail('')
      // Only reset school if not a school admin
      if (!isSchoolAdmin) setSchool('')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  if (loading) return <div><p>Loading...</p></div>

  return (
    <div>
      <h2>Users</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleInvite} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <select value={school} onChange={(e) => setSchool(e.target.value)} disabled={isSchoolAdmin} required={isSchoolAdmin}>
            <option value="">{isSchoolAdmin ? '-- your school --' : '-- select school (optional) --'}</option>
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
            <React.Fragment key={u._id}>
              <tr>
                <td style={{ padding: 6 }}>{u.email}</td>
                <td style={{ padding: 6 }}>{(() => {
                  if (!u.school) return '-';
                  if (typeof u.school === 'object' && u.school.name) return u.school.name;
                  // If u.school is an ID, look up in schools array
                  const found = schools.find(s => s._id === u.school);
                  return found ? found.name : u.school;
                })()}</td>
                <td style={{ padding: 6 }}>{u.invitedAt ? '✅' : '❌'}</td>
                <td style={{ padding: 6 }}>{u.acceptedAt ? '✅' : '❌'}</td>
                <td style={{ padding: 6 }}>
                  <button className="btn btn-small" onClick={() => setManageUserId(u._id)}>Manage</button>
                  <button className="btn btn-small" style={{ marginLeft: 4 }} onClick={async () => { if (!confirm('Delete this user?')) return; const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/users/${u._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (r.ok) setUsers(users.filter(x => x._id !== u._id)); }}>Delete</button>
                  <button className="btn btn-small" style={{ marginLeft: 4 }} onClick={() => { setResetUserId(u._id); setResetPassword(''); setResetError(null); }}>Set Password</button>
                  {!u.acceptedAt && (
                    <button className="btn btn-small" style={{ marginLeft: 4 }} onClick={async () => {
                      const r = await fetch(apiBase + `/cms/users/${u._id}/accept`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (r.ok) {
                        const updated = await r.json();
                        setUsers(users.map(x => x._id === u._id ? updated : x));
                      }
                    }}>Accept</button>
                  )}
                </td>
                    {manageUserId && (
                      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(2,6,23,0.25)' }}>
                          <UserDetails userId={manageUserId} token={token} onClose={() => setManageUserId(null)} onUserUpdated={() => { setManageUserId(null); reloadUsers(); }} />
                        </div>
                      </div>
                    )}
              </tr>
              {resetUserId === u._id && (
                <tr>
                  <td colSpan={6} style={{ background: '#f8f8f8', padding: 8 }}>
                    <form style={{ display: 'flex', gap: 8, alignItems: 'center' }} onSubmit={async (e) => {
                      e.preventDefault();
                      setResetError(null);
                      try {
                        const r = await fetch(apiBase + `/cms/users/${u._id}/set-password`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ password: resetPassword })
                        });
                        if (!r.ok) throw new Error((await r.json()).error || 'Failed');
                        setResetUserId(null);
                      } catch (err) {
                        setResetError(err.message || 'Error');
                      }
                    }}>
                      <input type="password" placeholder="New password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
                      <button className="btn btn-small" type="submit">Save</button>
                      <button className="btn btn-small" type="button" onClick={() => setResetUserId(null)}>Cancel</button>
                      {resetError && <span className="error">{resetError}</span>}
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
