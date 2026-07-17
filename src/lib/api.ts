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
  const response = await fetch(apiUrl('/api/auth/session'), { credentials: 'include' });
  if (!response.ok) {
    return { authenticated: false };
  }
  return response.json();
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Login failed');
  }
  return data.user;
}

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<User> {
  const response = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Registration failed');
  }
  return data.user;
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

export async function listAnalyses(projectId?: string, limit = 20): Promise<AnalysisSummary[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (projectId) params.set('projectId', projectId);
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

export async function revokeApiKey(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/api/keys/revoke?id=${encodeURIComponent(id)}`), {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to revoke API key');
  }
}
