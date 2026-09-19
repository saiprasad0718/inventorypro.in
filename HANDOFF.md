# InventoryPro.in — Handoff & Deployment Guide

Full-stack web app: React landing page + authenticated restaurant inventory SaaS.
Built for handoff to another AI assistant (e.g., Claude) or a developer for deployment
on Render (backend + frontend) with MongoDB Atlas (database).

---

## 1. What This App Is

- **Landing page** (`/`): marketing site with contact/enquiry form, WhatsApp button, embedded prototype demo (`/demo/inventorypro.html`), guided-tour teaser.
- **Web application** (`/login` → `/app`): staff login (JWT, roles: owner/manager/chef), 14 modules — Dashboard, Inventory, Purchase, Store Issue, Production, Recipes/BOM, Consumption, Wastage, Reconciliation, Variance, Reports, Compare (multi-outlet), Enquiries (lead inbox), Settings (staff, outlets, alerts).
- **Multi-outlet**: per-branch stock ledgers via `X-Outlet` header; outlet switcher in UI.
- **Emails**: enquiry notification + auto-reply, morning variance alert (8 AM IST), evening recap (10:30 PM IST) via background asyncio task.
- **Dish photos**: image uploads to object storage, served via authenticated endpoint.

## 2. Tech Stack

| Layer | Tech | Folder |
|---|---|---|
| Frontend | React 18 (CRA + craco), Tailwind, framer-motion, recharts, axios, react-router | `frontend/` |
| Backend | FastAPI, Motor (async MongoDB), bcrypt, PyJWT, httpx | `backend/` |
| Database | MongoDB (Atlas connection string) | — |

## 3. Repository Layout

```
backend/
  server.py        # app entry: CORS, /api router, enquiry endpoint, startup seed + alert loop
  database.py      # Mongo client (MONGO_URL, DB_NAME)
  auth.py          # JWT login, roles, brute-force lockout, staff management
  app_routes.py    # all app modules, outlets, alerts, recap, WhatsApp link, file serving
  seed.py          # demo data + default users (idempotent)
  storage.py       # object storage client
  requirements.txt
frontend/
  src/App.js                    # router: / /login /app/*
  src/pages/Landing.jsx, Login.jsx
  src/app/AppShell.jsx          # sidebar shell, outlet switcher, guided demo
  src/app/pages/*.jsx           # 14 module pages
  src/components/*.jsx          # landing sections
  public/demo/inventorypro.html # embedded prototype demo
  package.json (build: craco build)
```

## 4. Environment Variables

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`
(on Render, set these as service env vars instead).

**Backend:**
- `MONGO_URL` — MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/`)
- `DB_NAME` — e.g. `inventorypro`
- `CORS_ORIGINS` — `*` for quick start; tighten to your frontend URL later
- `JWT_SECRET` — any random 64-char hex string (generate: `openssl rand -hex 32`)
- `OWNER_SEED_EMAIL` / `OWNER_SEED_PASSWORD` — owner account created on first run
- Email + storage keys — **see section 6 (important)**

**Frontend (build-time):**
- `REACT_APP_BACKEND_URL` — the public URL of the backend service (e.g. `https://inventorypro-api.onrender.com`). No trailing slash. Note: CRA inlines this at build time — set it before building.

## 5. Deploying on Render

### Backend (Web Service)
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Set all backend env vars above
- Health check path: `/api/`
- A `render.yaml` blueprint is included at the repo root as a starting point

### Frontend (Static Site)
- Root directory: `frontend`
- Build command: `yarn install && yarn build`
- Publish directory: `build`
- Env var: `REACT_APP_BACKEND_URL` = backend's Render URL
- Add a rewrite rule: `/*` → `/index.html` (required for React Router deep links like `/login`)

### MongoDB Atlas
- Create a free M0 cluster → Database User → Network Access: allow `0.0.0.0/0` (Render has dynamic IPs) → copy connection string into `MONGO_URL`

### First run
- Backend auto-seeds demo data + 3 users on startup (idempotent).
- Owner login = OWNER_SEED_EMAIL / OWNER_SEED_PASSWORD. Manager/chef demo logins exist only if SEED_DEMO_USERS=true.

## 6. Off-Emergent changes (already applied)

- Email now uses Resend directly (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`) in `server.py -> send_email`.
- Dish photos are stored in MongoDB (`storage.py`, collection `file_blobs`).
- Emergent packages, tracking scripts and dev-overlay dependencies were removed; `requirements.txt` trimmed to runtime deps.
- Demo manager/chef users are only seeded when `SEED_DEMO_USERS=true`.

See DEPLOY.md for the step-by-step.

## 7. Suggested First Prompt for Claude

> "I've uploaded the InventoryPro source zip and HANDOFF.md. It's a FastAPI + React + MongoDB app.
> I've created the MongoDB Atlas cluster and Render account. Help me: (1) deploy the backend to Render
> with my Atlas connection string, (2) deploy the frontend as a static site pointing at it,
> (3) replace the email function with a direct Resend integration (my key: …),
> (4) verify the seed ran and I can log in as owner."

## 8. Quick Local Run

```bash
# backend
cd backend && pip install -r requirements.txt && uvicorn server:app --host 0.0.0.0 --port 8001
# frontend (new terminal)
cd frontend && yarn install && yarn start
```

Test credentials and auth API notes are in `auth_testing.md`.
