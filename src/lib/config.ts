/** External Meridian API — this repo is frontend-only. */
export const API_BASE = (
  import.meta.env.VITE_API_URL ?? 'https://api.meridian.dev'
).replace(/\/$/, '');

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
