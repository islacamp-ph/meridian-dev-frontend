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
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
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

export async function createApiKey(name: string): Promise<ApiKeySummary & { secret: string }> {
  const response = await fetch(apiUrl('/api/keys'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to create API key');
  }
  return data.key;
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
