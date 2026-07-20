import { FormEvent, useEffect, useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { fetchProviders, fetchSession, githubLoginUrl, register } from '../lib/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubEnabled, setGithubEnabled] = useState(false);
  const [providersLoaded, setProvidersLoaded] = useState(false);

  useEffect(() => {
    void fetchProviders().then((providers) => {
      setGithubEnabled(providers.github);
      setProvidersLoaded(true);
    });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name || undefined);
      const session = await fetchSession();
      if (!session.authenticated) {
        throw new Error(
          'Account created but no session cookie was stored. For local Docker: COOKIE_SECURE=false. If VITE_API_URL points at another origin, proxy /api through the site or set COOKIE_SAMESITE=none on HTTPS.',
        );
      }
      window.location.assign('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up with GitHub for the fastest path into the developer dashboard."
    >
      {providersLoaded && githubEnabled && (
        <>
          <a className="btn btn-primary auth-oauth" href={githubLoginUrl()}>
            Continue with GitHub
          </a>
          <div className="auth-divider" role="separator">
            <span>or email</span>
          </div>
        </>
      )}
      {providersLoaded && !githubEnabled && (
        <p className="auth-hint" role="status">
          Prefer GitHub? Configure OAuth on the API (
          <code>GITHUB_CLIENT_ID</code>, <code>GITHUB_CLIENT_SECRET</code>,{' '}
          <code>GITHUB_REDIRECT_URI</code>), then restart <code>ts-api</code>.
        </p>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            disabled={loading}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
          />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-secondary auth-submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create with email'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </AuthLayout>
  );
}
