# MERIDIAN Web

Frontend marketing site for [meridian.dev](https://meridian.dev).

This repository is **frontend-only**. Auth, waitlist, keys, and analyze APIs live on the separate Meridian backend.

## Local dev

```bash
npm install
npm run dev
```

Vite proxies `/api` and `/v1` to the backend (default `http://localhost:3080`). Leave `VITE_API_URL` unset so auth cookies stay same-origin.

Optional env (create `.env.local`):

```bash
# Production / remote API (required for Vercel). Locally, omit this to use the proxy.
# VITE_API_URL=https://api.meridian.dev
VITE_DOCS_URL=/docs
# VITE_DEV_API_PROXY=http://localhost:3080
```

## Auth (login / dashboard)

After sign-in, users land on `/dashboard` with:

| Tab | Purpose |
|---|---|
| Overview | Plan summary + quick actions |
| API keys | Create / revoke `msk_live_*` keys |
| Integrations | REST / CLI / SDK / Action snippets |
| Usage | Placeholder analytics |
| Webhooks | Coming soon |
| Account | Profile, password, GitHub link |

### Login methods

1. **GitHub OAuth (recommended)** — shown when the backend has `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_REDIRECT_URI`
2. **Email + password** — always available when the backend has `AUTH_SECRET` + storage

Local callback URL (must match the GitHub OAuth App exactly):

`http://localhost:5173/api/auth/github/callback`

See backend `docs/AUTH_SETUP.md` for creating the OAuth App.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | TypeScript only |
| `npm run preview` | Preview production build |
| `npm run deploy` | Vercel preview deploy |
| `npm run deploy:prod` | Vercel production deploy |

## CI

GitHub Actions runs typecheck + build on pushes and pull requests to `main` / `master`.

## Docker

```bash
npm run docker:build
npm run docker:run
```

Open [http://localhost:8080](http://localhost:8080).
