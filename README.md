# MERIDIAN Web

Frontend marketing site for [meridian.dev](https://meridian.dev).

This repository is **frontend-only**. Auth, waitlist, keys, and analyze APIs live on the separate Meridian backend (`VITE_API_URL`, default `https://api.meridian.dev`).

## Local dev

```bash
npm install
npm run dev
```

Optional env (create `.env.local`):

```bash
VITE_API_URL=https://api.meridian.dev
VITE_DOCS_URL=/docs
```

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
