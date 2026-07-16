import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { About } from './pages/About';
import { Changelog } from './pages/Changelog';
import { Dashboard } from './pages/Dashboard';
import { DocsWaitlist } from './pages/DocsWaitlist';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './styles.css';

function Root() {
  const path = window.location.pathname;

  if (path === '/login') return <Login />;
  if (path === '/register') return <Register />;
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return <Dashboard />;
  if (path === '/docs' || path.startsWith('/docs/')) return <DocsWaitlist />;
  if (path === '/about') return <About />;
  if (path === '/changelog') return <Changelog />;

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
