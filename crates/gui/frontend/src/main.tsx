import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { invoke } from '@tauri-apps/api/core';

// Global error handlers to capture client-side crashes and route to rust stdout
window.addEventListener('error', (event) => {
  const msg = `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
  invoke('log_frontend', { level: 'error', message: msg }).catch(() => {});
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error ? event.reason.stack || event.reason.message : String(event.reason);
  invoke('log_frontend', { level: 'error', message: `Unhandled rejection: ${reason}` }).catch(() => {});
});

// Simple load indicator
invoke('log_frontend', { level: 'info', message: 'Vite React application initialized.' }).catch(() => {});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
