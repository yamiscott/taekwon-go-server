import React, { useEffect, useState } from 'react';

const BELTS = [
  { value: 'white', label: 'White' },
  { value: 'orange_stripe', label: 'Orange Stripe' },
  { value: 'purple_stripe', label: 'Purple Stripe' },
  { value: 'yellow_stripe', label: 'Yellow Stripe' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green_stripe', label: 'Green Stripe' },
  { value: 'green', label: 'Green' },
  { value: 'blue_stripe', label: 'Blue Stripe' },
  { value: 'blue', label: 'Blue' },
  { value: 'red_stripe', label: 'Red Stripe' },
  { value: 'red', label: 'Red' },
  { value: 'black_stripe', label: 'Black Stripe' },
  { value: 'black_1', label: 'Black 1st Dan' },
  { value: 'black_2', label: 'Black 2nd Dan' },
  { value: 'black_3', label: 'Black 3rd Dan' },
  { value: 'black_4', label: 'Black 4th Dan' },
  { value: 'black_5', label: 'Black 5th Dan' },
  { value: 'black_6', label: 'Black 6th Dan' },
  { value: 'black_7', label: 'Black 7th Dan' },
  { value: 'black_8', label: 'Black 8th Dan' },
  { value: 'black_9', label: 'Black 9th Dan' },
];

export default function UserDetails({ userId, token, onClose, onUserUpdated }) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        setUser(d);
        setForm({
          belt: d.belt || '',
          isMaster: !!d.isMaster,
          isGrandmaster: !!d.isGrandmaster,
          active: d.active !== false,
          fullName: d.fullName || '',
          address: d.address || ''
        });
      });
  }, [userId, token]);

  const handleEdit = () => setEdit(true);
  const handleCancel = () => { setEdit(false); setError(''); };
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000') + `/cms/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!r.ok) throw new Error((await r.json()).error || 'Failed');
      setEdit(false);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      setError(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div style={{ padding: 48, color: '#e0e7ef', background: 'rgba(12,18,31,0.97)', borderRadius: 16, minWidth: 600, maxWidth: 800, boxShadow: '0 8px 32px rgba(2,6,23,0.45)' }}>Loading...</div>;

  return (
    <div style={{
      padding: 48,
      minWidth: 600,
      maxWidth: 800,
      color: '#e0e7ef',
      background: 'rgba(12,18,31,0.97)',
      borderRadius: 10,
      boxShadow: '0 8px 32px rgba(2,6,23,0.45)',
      position: 'relative',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 18,
          right: 24,
          fontSize: 32,
          background: 'none',
          border: 'none',
          color: '#e0e7ef',
          cursor: 'pointer',
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ❌
      </button>
      <h2 style={{ marginTop: 0, marginBottom: 32 }}>User Details</h2>
      {error && <div style={{ color: '#f87171', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 18, columnGap: 24, alignItems: 'center' }}>
          <label style={{ fontWeight: 600 }}>Email:</label>
          <span>{user.email}</span>
          <label style={{ fontWeight: 600 }}>School:</label>
          <span>{user.school && user.school.name ? user.school.name : '-'}</span>
          <label style={{ fontWeight: 600 }}>Belt:</label>
          {edit ? (
            <select name="belt" value={form.belt} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #222', background: '#1a2332', color: '#e0e7ef' }}>
              <option value="">-- Select Belt --</option>
              {BELTS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          ) : (
            <span>{BELTS.find(b => b.value === user.belt)?.label || user.belt || '-'}</span>
          )}
          <label style={{ fontWeight: 600 }}>Master:</label>
          {edit ? (
            <input type="checkbox" name="isMaster" checked={form.isMaster} onChange={handleChange} />
          ) : (
            <span>{user.isMaster ? '✅' : '❌'}</span>
          )}
          <label style={{ fontWeight: 600 }}>Grandmaster:</label>
          {edit ? (
            <input type="checkbox" name="isGrandmaster" checked={form.isGrandmaster} onChange={handleChange} />
          ) : (
            <span>{user.isGrandmaster ? '✅' : '❌'}</span>
          )}
          <label style={{ fontWeight: 600 }}>Active:</label>
          {edit ? (
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          ) : (
            <span>{user.active !== false ? '✅' : '❌'}</span>
          )}
          <label style={{ fontWeight: 600 }}>Full Name:</label>
          {edit ? (
            <input name="fullName" value={form.fullName} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #222' }} />
          ) : (
            <span>{user.fullName || '-'}</span>
          )}
          <label style={{ fontWeight: 600 }}>Address:</label>
          {edit ? (
            <input name="address" value={form.address} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #222' }} />
          ) : (
            <span>{user.address || '-'}</span>
          )}
        </div>
        {!edit && (
          <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
            <button className="btn" type="button" onClick={handleEdit}>Edit</button>
          </div>
        )}
        {edit && (
          <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
            <button className="btn primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn" type="button" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
}
