/** External Meridian API — empty/local uses same-origin (Vite proxy). */
export const API_BASE = (
  import.meta.env.VITE_API_URL ?? ''
).replace(/\/$/, '');

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE) return normalized;
  return `${API_BASE}${normalized}`;
}
