import { FormEvent, useEffect, useState } from 'react';
import { BrandMark } from '../components/BrandMark';
import {
  changePassword,
  createApiKey,
  createProject,
  createWebhook,
  deleteWebhook,
  fetchUsage,
  fetchSession,
  getAnalysis,
  githubLoginUrl,
  listAnalyses,
  listApiKeys,
  listProjects,
  listWebhooks,
  logout,
  removeProject,
  runDashboardAnalysis,
  revokeApiKey,
  updateAccount,
  type ApiKeySummary,
  type AnalysisSummary,
  type DashboardAnalyzeResult,
  type Project,
  type UsageSummary,
  type User,
  type WebhookSummary,
} from '../lib/api';
import {
  DOCS_URL,
  GITHUB_REPO,
  INSTALL_CLI,
  NPM_CLI,
  NPM_SDK,
  PYPI_SDK,
} from '../lib/constants';
import { API_BASE as CONFIGURED_API_BASE } from '../lib/config';

const API_BASE = CONFIGURED_API_BASE || 'https://api.meridian.dev';

type DashboardTab = 'overview' | 'projects' | 'api-keys' | 'playground' | 'integrations' | 'usage' | 'webhooks' | 'account';

const NAV_ITEMS: Array<{
  id: DashboardTab;
  label: string;
  badge?: string;
}> = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'api-keys', label: 'API keys' },
  { id: 'playground', label: 'Playground' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'usage', label: 'Usage' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'account', label: 'Account' },
];

const ANALYZE_CURL = `curl -X POST ${API_BASE}/v1/analyze \\
  -H "Authorization: Bearer <your-api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{"tx": "<base64-xdr>", "network": "testnet"}'`;

const JS_SDK_SNIPPET = `import { MeridianClient } from '@meridian/stellar';

const client = new MeridianClient({
  baseUrl: '${API_BASE}',
  apiKey: process.env.MERIDIAN_API_KEY,
});

const result = await client.analyze({
  tx: '<base64-xdr>',
  network: 'testnet',
});`;

const PY_SDK_SNIPPET = `from meridian import MeridianClient

client = MeridianClient(
    base_url="${API_BASE}",
    api_key=os.environ["MERIDIAN_API_KEY"],
)

result = client.analyze(tx="<base64-xdr>", network="testnet")`;

const GITHUB_ACTION_SNIPPET = `- name: MERIDIAN pre-execution check
  uses: ./packages/meridian-action
  with:
    tx-file: tx.xdr
    network: testnet
    ecosystem-manifest: manifest.json
    fail-on: ABORT
    api-url: ${API_BASE}
    api-key: \${{ secrets.MERIDIAN_API_KEY }}`;

const WEBHOOK_PAYLOAD_EXAMPLE = `{
  "event": "analysis.completed",
  "timestamp": "2026-07-08T12:00:00Z",
  "data": {
    "verdict": "WARN",
    "confidence": 0.82,
    "blast_radius": 45,
    "contracts_mapped": 6,
    "network": "testnet"
  }
}`;

function initials(user: User | null): string {
  if (!user) return '?';
  if (user.name?.trim()) {
    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }
  return user.email.slice(0, 2).toUpperCase();
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button type="button" className="btn btn-secondary compact dashboard-copy-btn" onClick={handleCopy}>
      {copied ? 'Copied' : label}
    </button>
  );
}

function IntegrationCard({
  title,
  description,
  code,
  links,
}: {
  title: string;
  description: string;
  code: string;
  links?: Array<{ href: string; label: string }>;
}) {
  return (
    <article className="dashboard-panel dashboard-integration-card">
      <div className="dashboard-integration-card-head">
        <h3>{title}</h3>
        <CopyButton text={code} />
      </div>
      <p>{description}</p>
      <pre className="dashboard-code-block"><code>{code}</code></pre>
      {links && links.length > 0 && (
        <div className="dashboard-integration-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisSummary | null>(null);
  const [tab, setTab] = useState<DashboardTab>('overview');
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('Production');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [githubOAuthEnabled, setGithubOAuthEnabled] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [accountMessage, setAccountMessage] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [keyNetwork, setKeyNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [playgroundTx, setPlaygroundTx] = useState('');
  const [playgroundNetwork, setPlaygroundNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [playgroundResult, setPlaygroundResult] = useState<DashboardAnalyzeResult | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookSummary[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [createdWebhookSecret, setCreatedWebhookSecret] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const session = await fetchSession();
      if (!session.authenticated || !session.user) {
        window.location.href = '/login';
        return;
      }
      setUser(session.user);
      setAccountName(session.user.name ?? '');
      setGithubOAuthEnabled(Boolean(session.githubOAuthEnabled));
      try {
        const [apiKeys, projectList, usageData, recent, hookList] = await Promise.all([
          listApiKeys(),
          listProjects(),
          fetchUsage(),
          listAnalyses(undefined, 20),
          listWebhooks().catch(() => [] as WebhookSummary[]),
        ]);
        setKeys(apiKeys);
        setProjects(projectList);
        setSelectedProjectId(projectList.find((project) => project.isDefault)?.id ?? projectList[0]?.id ?? '');
        setUsage(usageData);
        setAnalyses(recent);
        setWebhooks(hookList);
      } catch {
        setKeys([]);
      }
      setLoading(false);
    }
    void load();
  }, []);

  useEffect(() => {
    setError('');
    setAccountMessage('');
  }, [tab]);

  async function handleLogout() {
    await logout();
    window.location.href = '/';
  }

  async function handleCreateKey(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const key = await createApiKey(newKeyName, selectedProjectId, keyNetwork);
      setCreatedSecret(key.secret);
      setKeys(await listApiKeys());
      setNewKeyName('Production');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create key');
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateProject(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const project = await createProject(newProjectName);
      setProjects(await listProjects());
      setSelectedProjectId(project.id);
      setNewProjectName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Delete this empty project?')) return;
    setBusy(true);
    try {
      await removeProject(id);
      const next = await listProjects();
      setProjects(next);
      setSelectedProjectId(next.find((project) => project.isDefault)?.id ?? next[0]?.id ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setBusy(false);
    }
  }

  async function handlePlayground(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setPlaygroundResult(null);
    try {
      const result = await runDashboardAnalysis({
        projectId: selectedProjectId,
        tx: playgroundTx.trim(),
        network: playgroundNetwork,
      });
      setPlaygroundResult(result);
      const [nextUsage, recent] = await Promise.all([fetchUsage(), listAnalyses(undefined, 20)]);
      setUsage(nextUsage);
      setAnalyses(recent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleAnalysisDetail(id: string) {
    try {
      setSelectedAnalysis(await getAnalysis(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this API key? Applications using it will stop working.')) return;
    setBusy(true);
    setError('');
    try {
      await revokeApiKey(id);
      setKeys(await listApiKeys());
      if (createdSecret) setCreatedSecret(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke key');
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateWebhook(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setCreatedWebhookSecret(null);
    try {
      const webhook = await createWebhook({
        projectId: selectedProjectId || undefined,
        url: webhookUrl.trim(),
        events: ['analysis.completed', 'analysis.abort'],
      });
      setCreatedWebhookSecret(webhook.secret ?? null);
      setWebhookUrl('');
      setWebhooks(await listWebhooks(selectedProjectId || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteWebhook(id: string) {
    if (!confirm('Delete this webhook?')) return;
    setBusy(true);
    try {
      await deleteWebhook(id);
      setWebhooks(await listWebhooks(selectedProjectId || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete webhook');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateName(event: FormEvent) {
    event.preventDefault();
    setError('');
    setAccountMessage('');
    setBusy(true);
    try {
      const next = await updateAccount(accountName);
      setUser(next);
      setAccountMessage('Display name updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdatePassword(event: FormEvent) {
    event.preventDefault();
    setError('');
    setAccountMessage('');
    setBusy(true);
    try {
      const next = await changePassword(
        newPassword,
        user?.hasPassword ? currentPassword : undefined,
      );
      setUser(next);
      setCurrentPassword('');
      setNewPassword('');
      setAccountMessage(
        user?.hasPassword
          ? 'Password updated.'
          : 'Password set. You can also sign in with email.',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="dashboard-loading-shell" aria-busy="true">
          <div className="dashboard-loading-bar" />
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const hasKeys = keys.length > 0;
  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'there';

  return (
    <div className="page dashboard-page">
      <header className="dashboard-topbar">
        <a href="/" className="brand dashboard-brand">
          <BrandMark />
          <span className="brand-name">Meridian</span>
          <span className="brand-domain">dashboard</span>
        </a>
        <div className="dashboard-topbar-actions">
          <a className="dashboard-topbar-link" href={DOCS_URL}>
            Docs
          </a>
          <div className="dashboard-user-chip" title={user?.email}>
            <span className="dashboard-avatar" aria-hidden="true">
              {initials(user)}
            </span>
            <span className="dashboard-user-meta">
              <strong>{displayName}</strong>
              <span>{user?.email}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="dashboard-beta-banner" role="status">
        <span className="dashboard-beta-pill">Early beta</span>
        <p>
          Hosted API and keys may be limited. Prefer the{' '}
          <a href={DOCS_URL}>CLI quickstart</a> or self-host for production.
        </p>
      </div>

      <div className="dashboard-shell">
        <nav className="dashboard-nav" aria-label="Dashboard">
          <div className="dashboard-nav-items">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={tab === item.id ? 'active' : ''}
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {item.badge && <span className="dashboard-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
          <div className="dashboard-nav-footer">
            <a className="dashboard-nav-link" href="/playground">
              Playground
            </a>
            <button type="button" className="dashboard-nav-link danger" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </nav>

        <main className="dashboard-main">
          {error && (
            <div className="dashboard-error" role="alert">
              <span>{error}</span>
              <button type="button" className="dashboard-alert-dismiss" onClick={() => setError('')}>
                Dismiss
              </button>
            </div>
          )}

          {tab === 'overview' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Developer account</p>
                <h1>Welcome back, {displayName}</h1>
                <p className="dashboard-lead">
                  Generate an API key, wire up an integration, then run TRACE → FIELD → GRAVITY
                  before your next Soroban submit.
                </p>
              </header>

              <div className="dashboard-stat-grid">
                <article className="dashboard-stat">
                  <span>API keys</span>
                  <strong>{keys.length}<small>/5</small></strong>
                </article>
                <article className="dashboard-stat">
                  <span>Plan</span>
                  <strong>Early beta</strong>
                </article>
                <article className="dashboard-stat">
                  <span>Pipeline</span>
                  <strong>4 layers</strong>
                </article>
              </div>

              <div className="dashboard-panel dashboard-checklist">
                <div className="dashboard-panel-head">
                  <h2>Get started</h2>
                  <p>Two steps to your first analysis.</p>
                </div>
                <ol className="dashboard-steps">
                  <li className={hasKeys ? 'done' : ''}>
                    <div>
                      <strong>Create an API key</strong>
                      <p>Keys authenticate REST, SDK, and CI calls.</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary compact"
                      onClick={() => setTab('api-keys')}
                    >
                      {hasKeys ? 'Manage keys' : 'Generate key'}
                    </button>
                  </li>
                  <li>
                    <div>
                      <strong>Connect an integration</strong>
                      <p>Copy a curl, SDK, or GitHub Action snippet.</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary compact"
                      onClick={() => setTab('integrations')}
                    >
                      View integrations
                    </button>
                  </li>
                </ol>
              </div>

              <div className="dashboard-quick-grid">
                <a className="dashboard-quick-card" href={`${API_BASE}/v1/docs`} target="_blank" rel="noopener noreferrer">
                  <strong>API docs</strong>
                  <span>OpenAPI + Swagger UI</span>
                </a>
                <a className="dashboard-quick-card" href={DOCS_URL}>
                  <strong>Guides</strong>
                  <span>CLI, manifests, verdicts</span>
                </a>
                <button type="button" className="dashboard-quick-card" onClick={() => setTab('account')}>
                  <strong>Account</strong>
                  <span>Password &amp; GitHub</span>
                </button>
              </div>
              <div className="dashboard-panel dashboard-history-panel">
                <div className="dashboard-panel-head">
                  <h2>Recent analyses</h2>
                  <p>Your latest pre-execution verdicts.</p>
                </div>
                {analyses.length === 0 ? (
                  <div className="dashboard-empty-state">Run your first analysis in Playground.</div>
                ) : (
                  <div className="dashboard-history-list">
                    {analyses.slice(0, 5).map((analysis) => (
                      <button key={analysis.id} type="button" onClick={() => void handleAnalysisDetail(analysis.id)}>
                        <span className={`dashboard-verdict ${analysis.verdict.toLowerCase()}`}>{analysis.verdict}</span>
                        <strong>{analysis.network}</strong>
                        <span>{Math.round(analysis.confidence * 100)}% confidence</span>
                        <time>{formatDate(analysis.createdAt)}</time>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {tab === 'projects' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Workspaces</p>
                <h1>Projects &amp; environments</h1>
                <p className="dashboard-lead">Group API keys and usage by project, then separate testnet from mainnet.</p>
              </header>
              <div className="dashboard-panel">
                <div className="dashboard-panel-head"><h2>Create project</h2><p>Up to 10 per account.</p></div>
                <form className="dashboard-key-form" onSubmit={handleCreateProject}>
                  <label className="dashboard-field">
                    <span>Project name</span>
                    <input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Payments API" required />
                  </label>
                  <button className="btn btn-primary" disabled={busy}>Create project</button>
                </form>
              </div>
              <div className="dashboard-project-grid">
                {projects.map((project) => {
                  const projectKeys = keys.filter((key) => key.projectId === project.id);
                  return (
                    <article key={project.id} className="dashboard-panel dashboard-project-card">
                      <div className="dashboard-project-head">
                        <div><h2>{project.name}</h2>{project.isDefault && <span className="dashboard-provider-pill">Default</span>}</div>
                        {!project.isDefault && <button className="btn-link danger" onClick={() => void handleDeleteProject(project.id)}>Delete</button>}
                      </div>
                      <div className="dashboard-project-environments">
                        <span>Testnet <strong>{projectKeys.filter((key) => key.network === 'testnet').length} keys</strong></span>
                        <span>Mainnet <strong>{projectKeys.filter((key) => key.network === 'mainnet').length} keys</strong></span>
                      </div>
                      <button className="btn btn-secondary compact" onClick={() => { setSelectedProjectId(project.id); setTab('api-keys'); }}>Create project key</button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {tab === 'playground' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Analyze</p>
                <h1>Playground</h1>
                <p className="dashboard-lead">Simulate an XDR with your dashboard session—no API key paste required.</p>
              </header>
              <div className="dashboard-panel">
                <form className="dashboard-stack-form" onSubmit={handlePlayground}>
                  <div className="dashboard-form-row">
                    <label className="dashboard-field"><span>Project</span><select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
                    <label className="dashboard-field"><span>Network</span><select value={playgroundNetwork} onChange={(e) => setPlaygroundNetwork(e.target.value as 'testnet' | 'mainnet')}><option value="testnet">Testnet</option><option value="mainnet">Mainnet</option></select></label>
                  </div>
                  <label className="dashboard-field">
                    <span>Transaction XDR</span>
                    <textarea value={playgroundTx} onChange={(e) => setPlaygroundTx(e.target.value)} rows={9} placeholder="Paste base64 transaction XDR…" required />
                  </label>
                  <button className="btn btn-primary" disabled={busy || !selectedProjectId}>{busy ? 'Analyzing…' : 'Run analysis'}</button>
                </form>
              </div>
              {playgroundResult && (
                <div className="dashboard-panel dashboard-result">
                  <div className="dashboard-result-head"><span className={`dashboard-verdict ${playgroundResult.verdict.toLowerCase()}`}>{playgroundResult.verdict}</span><strong>{Math.round(playgroundResult.confidence * 100)}% confidence</strong></div>
                  <div className="dashboard-result-stats"><span>Blast radius <strong>{playgroundResult.gravity.blast_radius}</strong></span><span>Contracts <strong>{playgroundResult.field.contracts_mapped}</strong></span></div>
                  <p>{playgroundResult.brief}</p>
                </div>
              )}
            </section>
          )}

          {tab === 'api-keys' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Credentials</p>
                <h1>API keys</h1>
                <p className="dashboard-lead">
                  Pass as <code>Authorization: Bearer &lt;key&gt;</code> or{' '}
                  <code>X-Api-Key: &lt;key&gt;</code>. Limit: 5 keys per account.
                </p>
              </header>

              {createdSecret && (
                <div className="dashboard-secret-banner" role="status">
                  <div className="dashboard-secret-banner-copy">
                    <strong>Copy your new API key now</strong>
                    <p>It won&apos;t be shown again. Store it in your secrets manager.</p>
                  </div>
                  <code className="dashboard-secret-value">{createdSecret}</code>
                  <CopyButton text={createdSecret} label="Copy key" />
                </div>
              )}

              <div className="dashboard-panel">
                <div className="dashboard-panel-head">
                  <h2>Create key</h2>
                  <p>Name keys by environment — e.g. Production, CI, Local.</p>
                </div>
                <form className="dashboard-key-form" onSubmit={handleCreateKey}>
                  <label className="dashboard-field">
                    <span>Key name</span>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Production"
                      disabled={busy || keys.length >= 5}
                      required
                    />
                  </label>
                  <label className="dashboard-field">
                    <span>Project</span>
                    <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                      {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                    </select>
                  </label>
                  <label className="dashboard-field">
                    <span>Network</span>
                    <select value={keyNetwork} onChange={(e) => setKeyNetwork(e.target.value as 'testnet' | 'mainnet')}>
                      <option value="testnet">Testnet</option>
                      <option value="mainnet">Mainnet</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={busy || keys.length >= 5}
                  >
                    {busy ? 'Creating…' : 'Generate key'}
                  </button>
                </form>
                {keys.length >= 5 && (
                  <p className="dashboard-hint">You&apos;ve reached the 5-key limit. Revoke one to create another.</p>
                )}
              </div>

              <div className="dashboard-panel">
                <div className="dashboard-panel-head">
                  <h2>Your keys</h2>
                  <p>{keys.length === 0 ? 'No keys yet.' : `${keys.length} active`}</p>
                </div>

                {keys.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <p>Generate a key to call the hosted analyze API.</p>
                  </div>
                ) : (
                  <div className="dashboard-table-wrap">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Project / network</th>
                          <th>Prefix</th>
                          <th>Created</th>
                          <th>Last used</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {keys.map((key) => (
                          <tr key={key.id}>
                            <td>
                              <strong className="dashboard-key-name">{key.name}</strong>
                            </td>
                            <td>
                              {projects.find((project) => project.id === key.projectId)?.name ?? 'Default'}
                              {' · '}{key.network}
                            </td>
                            <td><code>{key.prefix}…</code></td>
                            <td>{formatDate(key.createdAt)}</td>
                            <td>{key.lastUsedAt ? formatDate(key.lastUsedAt) : '—'}</td>
                            <td className="dashboard-table-actions">
                              <button
                                type="button"
                                className="btn-link danger"
                                onClick={() => handleRevoke(key.id)}
                                disabled={busy}
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {tab === 'integrations' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Connect</p>
                <h1>Integrations</h1>
                <p className="dashboard-lead">
                  Copy a snippet and replace <code>&lt;your-api-key&gt;</code> with a key from
                  API keys.
                </p>
              </header>
              <div className="dashboard-integration-grid">
                <IntegrationCard
                  title="REST API"
                  description="Hosted analyze endpoint — TRACE, FIELD, GRAVITY, and optional BRIEF."
                  code={ANALYZE_CURL}
                  links={[{ href: `${API_BASE}/v1/openapi.json`, label: 'OpenAPI spec' }]}
                />
                <IntegrationCard
                  title="CLI"
                  description="Run analysis locally or in scripts without the hosted API."
                  code={INSTALL_CLI}
                  links={[
                    { href: NPM_CLI, label: 'npm' },
                    { href: GITHUB_REPO, label: 'GitHub' },
                  ]}
                />
                <IntegrationCard
                  title="JavaScript SDK"
                  description="TypeScript client for @meridian/stellar with typed request/response."
                  code={JS_SDK_SNIPPET}
                  links={[{ href: NPM_SDK, label: 'npm' }]}
                />
                <IntegrationCard
                  title="Python SDK"
                  description="httpx-based client for meridian-py pipelines and automation."
                  code={PY_SDK_SNIPPET}
                  links={[{ href: PYPI_SDK, label: 'PyPI' }]}
                />
                <IntegrationCard
                  title="GitHub Action"
                  description="Fail CI on WARN or ABORT before a Soroban transaction ships."
                  code={GITHUB_ACTION_SNIPPET}
                  links={[{ href: `${GITHUB_REPO}/tree/main/packages/meridian-action`, label: 'Action source' }]}
                />
                <article className="dashboard-panel dashboard-integration-card">
                  <h3>Quick reference</h3>
                  <p>API base URL and repository links.</p>
                  <ul className="dashboard-quick-ref">
                    <li>
                      <span>API base URL</span>
                      <code>{API_BASE}</code>
                    </li>
                    <li>
                      <span>Repository</span>
                      <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">{GITHUB_REPO}</a>
                    </li>
                    <li>
                      <span>Manifests</span>
                      <a href={`${GITHUB_REPO}/tree/main/manifests`} target="_blank" rel="noopener noreferrer">
                        ScholarSeal &amp; community manifests
                      </a>
                    </li>
                  </ul>
                </article>
              </div>
            </section>
          )}

          {tab === 'usage' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Analytics</p>
                <h1>Usage</h1>
                <p className="dashboard-lead">
                  Current-month activity and your early beta quota.
                </p>
              </header>
              <div className="dashboard-stat-grid">
                <article className="dashboard-stat">
                  <span>Quota units</span>
                  <strong>{usage?.totals.quotaUnits ?? 0}<small>/{usage?.quota.limit ?? 1000}</small></strong>
                </article>
                <article className="dashboard-stat">
                  <span>Analyze calls</span>
                  <strong>{usage?.totals.analyzeCalls ?? 0}</strong>
                </article>
                <article className="dashboard-stat">
                  <span>Batch jobs</span>
                  <strong>{usage?.totals.batchJobs ?? 0}</strong>
                </article>
              </div>
              <div className="dashboard-panel">
                <div className="dashboard-panel-head"><h2>Monthly quota</h2><p>Resets {usage ? formatDate(usage.quota.resetsAt) : 'next month'}.</p></div>
                <div className="dashboard-quota-track"><span style={{ width: `${Math.min(100, ((usage?.quota.used ?? 0) / (usage?.quota.limit ?? 1000)) * 100)}%` }} /></div>
              </div>
              <div className="dashboard-panel">
                <div className="dashboard-panel-head"><h2>Daily activity</h2><p>Quota units by day and network.</p></div>
                {(usage?.byDay.length ?? 0) === 0 ? <div className="dashboard-empty-state">No usage yet.</div> : (
                  <div className="dashboard-usage-chart">
                    {usage!.byDay.map((day) => {
                      const max = Math.max(...usage!.byDay.map((item) => item.quotaUnits), 1);
                      return <div key={`${day.day}-${day.network}`} title={`${day.day}: ${day.quotaUnits}`}><span style={{ height: `${Math.max(8, (day.quotaUnits / max) * 100)}%` }} /><small>{day.day.slice(5)}</small></div>;
                    })}
                  </div>
                )}
              </div>
              <div className="dashboard-panel">
                <div className="dashboard-panel-head"><h2>Analysis history</h2><p>Latest 20 runs.</p></div>
                <div className="dashboard-history-list">
                  {analyses.map((analysis) => <button key={analysis.id} onClick={() => void handleAnalysisDetail(analysis.id)}><span className={`dashboard-verdict ${analysis.verdict.toLowerCase()}`}>{analysis.verdict}</span><strong>{analysis.network}</strong><span>Blast {analysis.blastRadius}</span><time>{formatDate(analysis.createdAt)}</time></button>)}
                </div>
              </div>
            </section>
          )}

          {tab === 'webhooks' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Notifications</p>
                <h1>Webhooks</h1>
                <p className="dashboard-lead">
                  Receive signed POSTs when analyses complete or abort. Verify with{' '}
                  <code>X-Meridian-Signature</code> (HMAC-SHA256).
                </p>
              </header>

              <form className="dashboard-panel" onSubmit={handleCreateWebhook}>
                <h2>Add endpoint</h2>
                <label>
                  URL
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/hooks/meridian"
                    required
                    disabled={busy}
                  />
                </label>
                <button type="submit" className="btn btn-primary" disabled={busy || !webhookUrl.trim()}>
                  {busy ? 'Saving…' : 'Create webhook'}
                </button>
                {createdWebhookSecret && (
                  <p className="dashboard-secret-banner" role="status">
                    Signing secret (copy now): <code>{createdWebhookSecret}</code>
                  </p>
                )}
              </form>

              <div className="dashboard-panel">
                <h2>Endpoints</h2>
                {webhooks.length === 0 ? (
                  <p className="dashboard-lead">No webhooks yet.</p>
                ) : (
                  <ul className="dashboard-event-list">
                    {webhooks.map((hook) => (
                      <li key={hook.id}>
                        <code>{hook.url}</code>
                        <span>{hook.active ? 'active' : 'paused'}</span>
                        <span>{hook.events.join(', ')}</span>
                        <button
                          type="button"
                          className="btn btn-secondary compact"
                          onClick={() => void handleDeleteWebhook(hook.id)}
                          disabled={busy}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <h2>Example payload</h2>
                <pre className="dashboard-code-block"><code>{WEBHOOK_PAYLOAD_EXAMPLE}</code></pre>
              </div>
            </section>
          )}

          {tab === 'account' && (
            <section className="dashboard-section">
              <header className="dashboard-section-intro">
                <p className="dashboard-eyebrow">Settings</p>
                <h1>Account</h1>
                <p className="dashboard-lead">
                  Manage your profile, password, and connected sign-in methods.
                </p>
              </header>

              {accountMessage && (
                <p className="dashboard-success" role="status">{accountMessage}</p>
              )}

              <div className="dashboard-account-grid">
                <article className="dashboard-panel dashboard-account-card">
                  <h2>Profile</h2>
                  <dl className="dashboard-account-meta">
                    <div>
                      <dt>Email</dt>
                      <dd>{user?.email}</dd>
                    </div>
                    <div>
                      <dt>Sign-in methods</dt>
                      <dd>
                        {(user?.providers ?? []).map((provider) => (
                          <span key={provider} className="dashboard-provider-pill">
                            {provider === 'github' ? 'GitHub' : 'Email / password'}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  <form className="dashboard-stack-form" onSubmit={handleUpdateName}>
                    <label className="dashboard-field">
                      <span>Display name</span>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Display name"
                        disabled={busy}
                      />
                    </label>
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                      Save name
                    </button>
                  </form>
                </article>

                <article className="dashboard-panel dashboard-account-card">
                  <h2>{user?.hasPassword ? 'Change password' : 'Set a password'}</h2>
                  <p>
                    {user?.hasPassword
                      ? 'Update the password used for email sign-in.'
                      : 'You signed in with GitHub. Optionally set a password for email login.'}
                  </p>
                  <form className="dashboard-stack-form" onSubmit={handleUpdatePassword}>
                    {user?.hasPassword && (
                      <label className="dashboard-field">
                        <span>Current password</span>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          disabled={busy}
                        />
                      </label>
                    )}
                    <label className="dashboard-field">
                      <span>New password</span>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        disabled={busy}
                      />
                    </label>
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                      {user?.hasPassword ? 'Update password' : 'Set password'}
                    </button>
                  </form>
                </article>

                <article className="dashboard-panel dashboard-account-card">
                  <h2>GitHub</h2>
                  {user?.githubId ? (
                    <p>
                      Connected as GitHub user <code>{user.githubId}</code>. You can continue
                      signing in with GitHub.
                    </p>
                  ) : githubOAuthEnabled ? (
                    <>
                      <p>Link GitHub to enable one-click sign-in for this account.</p>
                      <a className="btn btn-secondary" href={githubLoginUrl()}>
                        Connect GitHub
                      </a>
                    </>
                  ) : (
                    <p>
                      GitHub OAuth is not configured on the API yet. Set{' '}
                      <code>GITHUB_CLIENT_ID</code>, <code>GITHUB_CLIENT_SECRET</code>, and{' '}
                      <code>GITHUB_REDIRECT_URI</code> on the backend.
                    </p>
                  )}
                </article>
              </div>
            </section>
          )}
          {selectedAnalysis && (
            <div className="dashboard-detail-backdrop" role="presentation" onClick={() => setSelectedAnalysis(null)}>
              <aside className="dashboard-detail" role="dialog" aria-modal="true" aria-label="Analysis detail" onClick={(event) => event.stopPropagation()}>
                <div className="dashboard-detail-head">
                  <span className={`dashboard-verdict ${selectedAnalysis.verdict.toLowerCase()}`}>{selectedAnalysis.verdict}</span>
                  <button className="btn-link" onClick={() => setSelectedAnalysis(null)}>Close</button>
                </div>
                <h2>Analysis detail</h2>
                <dl className="dashboard-detail-grid">
                  <div><dt>Network</dt><dd>{selectedAnalysis.network}</dd></div>
                  <div><dt>Confidence</dt><dd>{Math.round(selectedAnalysis.confidence * 100)}%</dd></div>
                  <div><dt>Blast radius</dt><dd>{selectedAnalysis.blastRadius}</dd></div>
                  <div><dt>Contracts</dt><dd>{selectedAnalysis.contractsMapped}</dd></div>
                </dl>
                <h3>Brief</h3>
                <p>{selectedAnalysis.brief || 'No brief stored.'}</p>
                {selectedAnalysis.topRisks.length > 0 && <><h3>Top risks</h3><ul>{selectedAnalysis.topRisks.map((risk, index) => <li key={risk.id ?? index}>{risk.title ?? risk.description ?? risk.severity ?? 'Risk detected'}</li>)}</ul></>}
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
