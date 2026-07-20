import { FormEvent, useEffect, useState } from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { fetchProviders, fetchSession, githubLoginUrl, login } from '../lib/api';

function readQueryError(): string {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error') ?? '';
  if (error === 'session') {
    return 'Signed in, but the session cookie was not kept. For local dev, ensure the API sets COOKIE_SECURE=false. For a separate API host, use same-origin proxy or COOKIE_SAMESITE=none over HTTPS.';
  }
  return error;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(readQueryError);
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
      await login(email, password);
      const session = await fetchSession();
      if (!session.authenticated) {
        throw new Error(
          'Login succeeded but no session cookie was stored. For local Docker: COOKIE_SECURE=false. If VITE_API_URL points at another origin, proxy /api through the site or set COOKIE_SAMESITE=none on HTTPS.',
        );
      }
      window.location.assign('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Continue with GitHub to open your dashboard and API keys."
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
          GitHub sign-in is the recommended path. Add{' '}
          <code>GITHUB_CLIENT_ID</code>, <code>GITHUB_CLIENT_SECRET</code>, and{' '}
          <code>GITHUB_REDIRECT_URI</code> on the API, then restart <code>ts-api</code>.
        </p>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            disabled={loading}
          />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-secondary auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in with email'}
        </button>
      </form>
      <p className="auth-switch">
        No account yet? <a href="/register">Create one</a>
      </p>
    </AuthLayout>
  );
}
