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

  useEffect(() => {
    void fetchProviders().then((providers) => setGithubEnabled(providers.github));
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
      subtitle="Early beta access to the developer dashboard."
    >
      {githubEnabled && (
        <>
          <a className="btn btn-secondary auth-oauth" href={githubLoginUrl()}>
            Continue with GitHub
          </a>
          <div className="auth-divider" role="separator">
            <span>or</span>
          </div>
        </>
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
        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </AuthLayout>
  );
}
