import React, { useEffect, useState } from 'react'
import SchoolDetails from './SchoolDetails'

export default function Schools({ token }) {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [error, setError] = useState(null)
  const [manageSchoolId, setManageSchoolId] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const loadSchools = () => {
    if (!token) return
    setLoading(true)
    fetch(apiBase + '/cms/schools', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setSchools(Array.isArray(d) ? d : []))
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSchools()
  }, [token])

  const handleCreate = async (e) => {
    e.preventDefault(); setError(null)
    try {
      const r = await fetch(apiBase + '/cms/schools', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, address, contact }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setSchools([d, ...schools])
      setName(''); setAddress(''); setContact('')
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this school?')) return
    const r = await fetch(apiBase + `/cms/schools/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (r.ok) setSchools(schools.filter((x) => x._id !== id))
  }

  if (loading) return <div><p>Loading...</p></div>

  return (
    <div>
      <h2>Schools</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input placeholder="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
          <button className="btn" type="submit">Create</button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6 }}>Name</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Address</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Contact</th>
            <th style={{ textAlign: 'left', padding: 6 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((s) => (
            <tr key={s._id}>
              <td style={{ padding: 6 }}>{s.name}</td>
              <td style={{ padding: 6 }}>{s.address}</td>
              <td style={{ padding: 6 }}>{s.contact}</td>
              <td style={{ padding: 6 }}>
                <button className="btn btn-small" onClick={() => setManageSchoolId(s._id)}>Manage</button>
                <button className="btn btn-small" onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {manageSchoolId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(9,13,23,0.76)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 2000 }}>
          <SchoolDetails
            schoolId={manageSchoolId}
            token={token}
            onClose={() => setManageSchoolId(null)}
            onUpdated={() => {
              loadSchools()
            }}
          />
        </div>
      )}
    </div>
  )
}
