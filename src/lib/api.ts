import { apiUrl } from './config';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  avatarUrl?: string;
  githubId?: string;
  hasPassword: boolean;
  providers: Array<'password' | 'github'>;
}

export interface ApiKeySummary {
  id: string;
  projectId?: string;
  network: 'testnet' | 'mainnet';
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UsageDay {
  day: string;
  network: 'testnet' | 'mainnet';
  analyzeCalls: number;
  batchJobs: number;
  batchItems: number;
  quotaUnits: number;
}

export interface UsageSummary {
  totals: { analyzeCalls: number; batchJobs: number; batchItems: number; quotaUnits: number };
  byDay: UsageDay[];
  quota: { used: number; limit: number; resetsAt: string };
}

export interface AnalysisSummary {
  id: string;
  projectId: string;
  apiKeyId?: string;
  network: 'testnet' | 'mainnet';
  verdict: 'CLEAR' | 'WARN' | 'ABORT';
  confidence: number;
  blastRadius: number;
  contractsMapped: number;
  brief: string;
  topRisks: Array<{ id?: string; severity?: string; title?: string; description?: string }>;
  createdAt: string;
}

export interface DashboardAnalyzeResult {
  verdict: 'CLEAR' | 'WARN' | 'ABORT';
  confidence: number;
  brief: string;
  top_risks: AnalysisSummary['topRisks'];
  gravity: { blast_radius: number; recovery?: string };
  field: { contracts_mapped: number };
}

export interface AuthProviders {
  password: boolean;
  github: boolean;
}

function apiUnreachableMessage(status?: number): string {
  if (status === 503) {
    return 'API not ready (auth/storage). Start the backend with npm run docker:up && npm run docker:wait, or set AUTH_SECRET and DATABASE_URL.';
  }
  return 'API unreachable (Bad gateway). For local dev: leave VITE_API_URL unset, run the backend on :3080 (npm run docker:up && npm run docker:wait), or set VITE_DEV_API_PROXY.';
}

async function readJsonBody(response: Response): Promise<Record<string, unknown>> {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

function errorFromResponse(data: Record<string, unknown>, fallback: string, status: number): Error {
  if (status === 502 || status === 503 || status === 504) {
    const detail = typeof data.details === 'string' ? ` ${data.details}` : '';
    return new Error(`${apiUnreachableMessage(status)}${detail}`);
  }
  const msg = typeof data.error === 'string' ? data.error : fallback;
  return new Error(msg);
}

export async function fetchProviders(): Promise<AuthProviders> {
  try {
    const response = await fetch(apiUrl('/api/auth/providers'), { credentials: 'include' });
    if (!response.ok) {
      return { password: true, github: false };
    }
    return response.json();
  } catch {
    return { password: true, github: false };
  }
}

export function githubLoginUrl(): string {
  return apiUrl('/api/auth/github');
}

export async function fetchSession(): Promise<{
  authenticated: boolean;
  user?: User;
  githubOAuthEnabled?: boolean;
}> {
  try {
    const response = await fetch(apiUrl('/api/auth/session'), { credentials: 'include' });
    if (!response.ok) {
      return { authenticated: false };
    }
    return response.json();
  } catch {
    return { authenticated: false };
  }
}

export async function login(email: string, password: string): Promise<User> {
  let response: Response;
  try {
    response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(apiUnreachableMessage());
  }
  const data = await readJsonBody(response);
  if (!response.ok) {
    throw errorFromResponse(data, 'Login failed', response.status);
  }
  return data.user as User;
}

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<User> {
  let response: Response;
  try {
    response = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });
  } catch {
    throw new Error(apiUnreachableMessage());
  }
  const data = await readJsonBody(response);
  if (!response.ok) {
    throw errorFromResponse(data, 'Registration failed', response.status);
  }
  return data.user as User;
}

export async function logout(): Promise<void> {
  await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
}

export async function updateAccount(name: string): Promise<User> {
  const response = await fetch(apiUrl('/api/auth/account'), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to update account');
  }
  return data.user;
}

export async function changePassword(
  newPassword: string,
  currentPassword?: string,
): Promise<User> {
  const response = await fetch(apiUrl('/api/auth/password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ newPassword, currentPassword }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to update password');
  }
  return data.user;
}

export async function listApiKeys(): Promise<ApiKeySummary[]> {
  const response = await fetch(apiUrl('/api/keys'), { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load API keys');
  }
  return data.keys;
}

export async function createApiKey(
  name: string,
  projectId?: string,
  network: 'testnet' | 'mainnet' = 'testnet',
): Promise<ApiKeySummary & { secret: string }> {
  const response = await fetch(apiUrl('/api/keys'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, projectId, network }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to create API key');
  }
  return data.key;
}

async function siteRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    credentials: 'include',
    headers: init?.body
      ? { 'Content-Type': 'application/json', ...init.headers }
      : init?.headers,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? 'Request failed');
  return data as T;
}

export async function listProjects(): Promise<Project[]> {
  return (await siteRequest<{ projects: Project[] }>('/api/projects')).projects;
}

export async function createProject(name: string): Promise<Project> {
  return (await siteRequest<{ project: Project }>('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })).project;
}

export async function renameProject(id: string, name: string): Promise<Project> {
  return (await siteRequest<{ project: Project }>(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })).project;
}

export async function removeProject(id: string): Promise<void> {
  await siteRequest(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function fetchUsage(projectId?: string): Promise<UsageSummary> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
  return siteRequest<UsageSummary>(`/api/usage${query}`);
}

export async function listAnalyses(
  projectId?: string,
  limit = 20,
  filters?: { page?: number; verdict?: string; network?: string },
): Promise<AnalysisSummary[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (projectId) params.set('projectId', projectId);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.verdict) params.set('verdict', filters.verdict);
  if (filters?.network) params.set('network', filters.network);
  return (await siteRequest<{ analyses: AnalysisSummary[] }>(`/api/analyses?${params}`)).analyses;
}

export async function getAnalysis(id: string): Promise<AnalysisSummary> {
  return (await siteRequest<{ analysis: AnalysisSummary }>(
    `/api/analyses/${encodeURIComponent(id)}`,
  )).analysis;
}

export async function runDashboardAnalysis(input: {
  projectId: string;
  tx: string;
  network: 'testnet' | 'mainnet';
}): Promise<DashboardAnalyzeResult> {
  return siteRequest<DashboardAnalyzeResult>('/api/playground/analyze', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface WebhookSummary {
  id: string;
  projectId: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  secret?: string;
}

export async function listWebhooks(projectId?: string): Promise<WebhookSummary[]> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
  return (await siteRequest<{ webhooks: WebhookSummary[] }>(`/api/webhooks${query}`)).webhooks;
}

export async function createWebhook(input: {
  projectId?: string;
  url: string;
  events?: string[];
}): Promise<WebhookSummary> {
  return (await siteRequest<{ webhook: WebhookSummary }>('/api/webhooks', {
    method: 'POST',
    body: JSON.stringify(input),
  })).webhook;
}

export async function updateWebhook(
  id: string,
  input: { url?: string; events?: string[]; active?: boolean },
): Promise<WebhookSummary> {
  return (await siteRequest<{ webhook: WebhookSummary }>(
    `/api/webhooks/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify(input) },
  )).webhook;
}

export async function deleteWebhook(id: string): Promise<void> {
  await siteRequest(`/api/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function rotateApiKey(id: string): Promise<ApiKeySummary & { secret: string }> {
  return (await siteRequest<{ key: ApiKeySummary & { secret: string } }>(
    `/api/keys/${encodeURIComponent(id)}/rotate`,
    { method: 'POST' },
  )).key;
}

export async function revokeApiKey(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/api/keys/revoke?id=${encodeURIComponent(id)}`), {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? 'Failed to revoke API key');
  }
}
