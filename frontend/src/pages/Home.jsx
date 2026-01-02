import React, { useEffect, useState } from 'react'

export default function Home({ token, admin }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const isSchoolAdmin = admin?.role === 'school'

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`${apiBase}/cms/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div style={{ padding: 20 }}><p>Loading dashboard...</p></div>

  const CircleChart = ({ percentage, label }) => {
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="16"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <text
            x="90"
            y="90"
            textAnchor="middle"
            dy="8"
            fill="#eef2ff"
            fontSize="32"
            fontWeight="700"
            transform="rotate(90 90 90)"
          >
            {Math.round(percentage)}%
          </text>
        </svg>
        <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>{label}</p>
      </div>
    )
  }

  if (isSchoolAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 24 }}>Dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* School Details Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))', 
            borderRadius: 16, 
            padding: 28, 
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 8px 32px rgba(2,6,23,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              {stats?.school?.logoUrl ? (
                <img 
                  src={`${apiBase}${stats.school.logoUrl}`} 
                  alt="School Logo" 
                  style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }}
                />
              ) : (
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 12, 
                  background: 'rgba(124,58,237,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28
                }}>
                  🥋
                </div>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: 20 }}>{stats?.school?.name || 'School'}</h3>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 13 }}>{stats?.school?.address || ''}</p>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: 16, 
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>Total Students</span>
              <span style={{ fontSize: 32, fontWeight: 700, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stats?.totalStudents || 0}
              </span>
            </div>
          </div>

          {/* Users Chart Card */}
          <div style={{ 
            background: 'rgba(12,18,31,0.6)', 
            borderRadius: 16, 
            padding: 28, 
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 8px 32px rgba(2,6,23,0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18 }}>Student Invitations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircleChart 
                percentage={stats?.totalStudents > 0 ? (stats.acceptedStudents / stats.totalStudents * 100) : 0}
                label="Acceptance Rate"
              />
              <div style={{ width: '100%', marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(124,58,237,0.1)', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#7C3AED' }}>{stats?.totalStudents || 0}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Invited</div>
                </div>
                <div style={{ background: 'rgba(6,182,212,0.1)', padding: 12, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#06B6D4' }}>{stats?.acceptedStudents || 0}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Accepted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Super Admin Dashboard
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0, marginBottom: 24 }}>Super Admin Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Total Schools Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))', 
          borderRadius: 16, 
          padding: 28, 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px rgba(2,6,23,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>Total Schools</div>
          <div style={{ fontSize: 48, fontWeight: 700, background: 'linear-gradient(90deg, #7C3AED, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats?.totalSchools || 0}
          </div>
        </div>

        {/* Total Users Chart */}
        <div style={{ 
          background: 'rgba(12,18,31,0.6)', 
          borderRadius: 16, 
          padding: 28, 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px rgba(2,6,23,0.2)'
        }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16 }}>All Users</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleChart 
              percentage={stats?.totalUsers > 0 ? (stats.acceptedUsers / stats.totalUsers * 100) : 0}
              label="Acceptance Rate"
            />
            <div style={{ width: '100%', marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'rgba(124,58,237,0.1)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#7C3AED' }}>{stats?.totalUsers || 0}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Invited</div>
              </div>
              <div style={{ background: 'rgba(6,182,212,0.1)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#06B6D4' }}>{stats?.acceptedUsers || 0}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Accepted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Schools by Members */}
        <div style={{ 
          background: 'rgba(12,18,31,0.6)', 
          borderRadius: 16, 
          padding: 28, 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px rgba(2,6,23,0.2)'
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Top Schools by Members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats?.topSchoolsByMembers?.slice(0, 5).map((school, idx) => (
              <div key={school._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: 10,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 8
              }}>
                <div style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#7C3AED'}, rgba(124,58,237,0.3))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{school.name}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#06B6D4' }}>{school.count}</div>
              </div>
            )) || <p style={{ color: '#94a3b8', fontSize: 13 }}>No data</p>}
          </div>
        </div>

        {/* Top Schools by Admins */}
        <div style={{ 
          background: 'rgba(12,18,31,0.6)', 
          borderRadius: 16, 
          padding: 28, 
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px rgba(2,6,23,0.2)'
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Top Schools by Admins</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats?.topSchoolsByAdmins?.slice(0, 5).map((school, idx) => (
              <div key={school._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: 10,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 8
              }}>
                <div style={{ 
                  width: 28, 
                  height: 28, 
                  borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#7C3AED'}, rgba(124,58,237,0.3))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{school.name}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#7C3AED' }}>{school.count}</div>
              </div>
            )) || <p style={{ color: '#94a3b8', fontSize: 13 }}>No data</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
