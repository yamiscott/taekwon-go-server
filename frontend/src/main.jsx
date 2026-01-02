import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Accept from './pages/Accept'
import './index.css'

function Router() {
	const path = window.location.pathname;
	if (path.startsWith('/accept')) return <Accept />;
	return <App />;
}

createRoot(document.getElementById('root')).render(<Router />)
