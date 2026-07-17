import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { About } from './pages/About';
import { Changelog } from './pages/Changelog';
import { CiAction } from './pages/CiAction';
import { Dashboard } from './pages/Dashboard';
import { Docs } from './pages/Docs';
import { Login } from './pages/Login';
import { Manifests } from './pages/Manifests';
import { Playground } from './pages/Playground';
import { Register } from './pages/Register';
import './styles.css';

function Root() {
  const path = window.location.pathname;

  if (path === '/login') return <Login />;
  if (path === '/register') return <Register />;
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return <Dashboard />;
  if (path === '/docs' || path.startsWith('/docs/')) return <Docs />;
  if (path === '/about') return <About />;
  if (path === '/changelog') return <Changelog />;
  if (path === '/playground') return <Playground />;
  if (path === '/ci' || path === '/github-action') return <CiAction />;
  if (path === '/manifests') return <Manifests />;

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
