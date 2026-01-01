import React from 'react'

export default function RightPanel({ children }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: 32, overflowX: 'auto' }}>
      {children}
    </div>
  )
}
