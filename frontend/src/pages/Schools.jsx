import React, { useEffect, useState } from 'react'

export default function Schools({ token }) {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [error, setError] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(apiBase + '/cms/schools', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setSchools(Array.isArray(d) ? d : []))
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
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
              <td style={{ padding: 6 }}>{s._editing ? <input value={s._name} onChange={(e) => setSchools(schools.map(x => x._id === s._id ? { ...x, _name: e.target.value } : x))} /> : s.name}</td>
              <td style={{ padding: 6 }}>{s._editing ? <input value={s._address} onChange={(e) => setSchools(schools.map(x => x._id === s._id ? { ...x, _address: e.target.value } : x))} /> : s.address}</td>
              <td style={{ padding: 6 }}>{s._editing ? <input value={s._contact} onChange={(e) => setSchools(schools.map(x => x._id === s._id ? { ...x, _contact: e.target.value } : x))} /> : s.contact}</td>
              <td style={{ padding: 6 }}>
                {s._editing ? (
                  <>
                    <button className="btn btn-small" onClick={async () => {
                      try {
                        const body = { name: s._name, address: s._address, contact: s._contact };
                        const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/schools/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
                        if (!r.ok) throw new Error('Update failed');
                        const d = await r.json();
                        setSchools(schools.map(x => x._id === s._id ? d : x));
                      } catch (err) { console.error(err); }
                    }}>Save</button>
                    <button className="btn btn-small" onClick={() => setSchools(schools.map(x => x._id === s._id ? { ...x, _editing: false } : x))}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-small" onClick={() => setSchools(schools.map(x => x._id === s._id ? { ...x, _editing: true, _name: s.name, _address: s.address, _contact: s.contact } : x))}>Edit</button>
                    <button className="btn btn-small" onClick={async () => { if (!confirm('Delete this school?')) return; const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/schools/${s._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); if (r.ok) setSchools(schools.filter(x => x._id !== s._id)); }}>Delete</button>
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
