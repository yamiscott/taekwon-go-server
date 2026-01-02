import React, { useEffect, useState } from 'react'

export default function SchoolDetails({ schoolId, token, onClose, onUpdated }) {
  const [school, setSchool] = useState(null)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', contact: '' })
  const [logoPreview, setLogoPreview] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!schoolId) return
    fetch(`${apiBase}/cms/schools/${schoolId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setSchool(d)
        setForm({ name: d.name || '', address: d.address || '', contact: d.contact || '' })
        setLogoPreview(d.logoUrl ? `${apiBase}${d.logoUrl}` : '')
      })
      .catch(() => setError('Failed to load school'))
  }, [schoolId, token, apiBase])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSaveDetails = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const r = await fetch(`${apiBase}/cms/schools/${schoolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Failed')
      setSchool(d)
      setForm({ name: d.name || '', address: d.address || '', contact: d.contact || '' })
      setLogoPreview(d.logoUrl ? `${apiBase}${d.logoUrl}` : '')
      setEdit(false)
      if (onUpdated) onUpdated()
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleUploadLogo = async () => {
    if (!logoFile) return
    setSaving(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('logo', logoFile)
      const r = await fetch(`${apiBase}/cms/schools/${schoolId}/logo`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Upload failed')
      setSchool(d)
      setLogoPreview(d.logoUrl ? `${apiBase}${d.logoUrl}` : '')
      setLogoFile(null)
      if (onUpdated) onUpdated()
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  if (!school) {
    return (
      <div style={{ padding: 48, color: '#e0e7ef', background: 'rgba(12,18,31,0.97)', borderRadius: 16, minWidth: 600, maxWidth: 800, boxShadow: '0 8px 32px rgba(2,6,23,0.45)' }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ padding: 48, minWidth: 600, maxWidth: 800, color: '#e0e7ef', background: 'rgba(12,18,31,0.97)', borderRadius: 12, boxShadow: '0 8px 32px rgba(2,6,23,0.45)', position: 'relative' }}>
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 18, right: 24, fontSize: 24, background: 'none', border: 'none', color: '#e0e7ef', cursor: 'pointer', lineHeight: 1 }}
        aria-label="Close"
      >
        X
      </button>
      <h2 style={{ marginTop: 0, marginBottom: 24 }}>School Details</h2>
      {error && <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 16, columnGap: 24, alignItems: 'center', marginBottom: 24 }}>
        <label style={{ fontWeight: 600 }}>Name:</label>
        {edit ? (
          <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #222' }} />
        ) : (
          <span>{school.name}</span>
        )}

        <label style={{ fontWeight: 600 }}>Address:</label>
        {edit ? (
          <input name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #222' }} />
        ) : (
          <span>{school.address || '-'}</span>
        )}

        <label style={{ fontWeight: 600 }}>Contact:</label>
        {edit ? (
          <input name="contact" value={form.contact} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #222' }} />
        ) : (
          <span>{school.contact || '-'}</span>
        )}

        <label style={{ fontWeight: 600 }}>Logo:</label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 120, height: 120, background: '#0f1629', borderRadius: 12, border: '1px solid #1f2a3d', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {logoPreview ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ color: '#94a3b8' }}>No logo</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="file" accept="image/png, image/jpeg" onChange={handleLogoChange} />
            <button className="btn" type="button" onClick={handleUploadLogo} disabled={saving || !logoFile}>{saving ? 'Uploading...' : 'Upload Logo'}</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {edit ? (
          <>
            <button className="btn primary" onClick={(e) => { e.preventDefault(); handleSaveDetails(e); }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn" onClick={(e) => { e.preventDefault(); setEdit(false); setForm({ name: school.name || '', address: school.address || '', contact: school.contact || '' }); setError(''); }}>Cancel</button>
          </>
        ) : (
          <button className="btn" onClick={(e) => { e.preventDefault(); setEdit(true); }}>Edit</button>
        )}
      </div>
    </div>
  )
}
