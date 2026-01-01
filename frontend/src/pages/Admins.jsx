import React, { useEffect, useState } from 'react'

export default function Admins({ token }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('school')
  const [school, setSchool] = useState('')
  const [schools, setSchools] = useState([])
  const [error, setError] = useState(null)

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!token) return
    setLoading(true)
    Promise.all([
      fetch(apiBase + '/cms/admins', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(apiBase + '/cms/schools', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
    ])
      .then(([adminsRes, schoolsRes]) => {
        setAdmins(Array.isArray(adminsRes) ? adminsRes : [])
        setSchools(Array.isArray(schoolsRes) ? schoolsRes : [])
      })
      .catch((err) => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [token])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const body = { email, password, role }
      if (role === 'school') body.school = school || null
      const r = await fetch(apiBase + '/cms/admins', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setAdmins([d, ...admins])
      setEmail('')
      setPassword('')
      setSchool('')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  if (loading) return <div className="login-right"><p>Loading...</p></div>

  return (
    <div className="login-right">
      <h2>Admins</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="school">School Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          {role === 'school' && (
            <select value={school} onChange={(e) => setSchool(e.target.value)}>
              <option value="">-- select school --</option>
              {schools.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          )}
          <button className="btn" type="submit">Create</button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6 }}>Email</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Role</th>
            <th style={{ textAlign: 'left', padding: 6 }}>School</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a._id}>
              <td style={{ padding: 6 }}>
                {a._editing ? (
                  <input value={a._email} onChange={(e) => setAdmins(admins.map(x => x._id === a._id ? { ...x, _email: e.target.value } : x))} />
                ) : a.email}
              </td>
              <td style={{ padding: 6 }}>
                {a._editing ? (
                  <select value={a._role} onChange={(e) => setAdmins(admins.map(x => x._id === a._id ? { ...x, _role: e.target.value } : x))}>
                    <option value="school">School</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                ) : a.role}
              </td>
              <td style={{ padding: 6 }}>
                {a._editing ? (
                  <select value={a._school} onChange={(e) => setAdmins(admins.map(x => x._id === a._id ? { ...x, _school: e.target.value } : x))}>
                    <option value="">-- none --</option>
                    {schools.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                ) : (a.school ? (typeof a.school === 'object' ? a.school.name : a.school) : '-')}
              </td>
              <td style={{ padding: 6 }}>
                {a._editing ? (
                  <>
                    <button className="btn btn-small" onClick={async () => {
                      try {
                        const body = { email: a._email, role: a._role, school: a._school || null };
                        const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/admins/${a._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
                        if (!r.ok) throw new Error('Update failed');
                        const d = await r.json();
                        setAdmins(admins.map(x => x._id === a._id ? d : x));
                      } catch (err) { console.error(err); }
                    }}>Save</button>
                    <button className="btn btn-small" onClick={() => setAdmins(admins.map(x => x._id === a._id ? { ...x, _editing: false } : x))}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-small" onClick={() => setAdmins(admins.map(x => x._id === a._id ? { ...x, _editing: true, _email: a.email, _role: a.role, _school: a.school && a.school._id ? a.school._id : (a.school || '') } : x))}>Edit</button>
                    <button className="btn btn-small" onClick={async () => {
                      if (!confirm('Delete this admin?')) return;
                      const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/admins/${a._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                      if (r.ok) setAdmins(admins.filter(x => x._id !== a._id));
                    }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
