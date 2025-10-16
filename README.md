# ToggleForge Entitlements & Licensing — API & Admin UI

A production-ready **entitlements and licensing** solution for SaaS products. Ship plans, features, numeric limits, tenant assignments, monthly usage windows, and a `/whoami` resolver for clean feature-gating across your apps.

- **Entitlements API (NestJS · Prisma · PostgreSQL)** — Plans & features matrix, per-tenant assignments/overrides, metrics/usage windows, and a stable read model for gating.
- **Admin UI (Next.js · Argon Dashboard)** — Friendly CRUD for Plans, Features, Tenants, and Usage, plus a live **WhoAmI** preview for developers and support teams.

> Built for ToggleForge-style ecosystems: strict TypeScript, clear module boundaries, pragmatic defaults, and production-ready ergonomics.


---
![Product Image](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/nextjs-argon-dashboard/nextjs-argon-dashboard.jpg)
## 🔗 Repositories

- **API:** `toggleforge-entitlements-api`  
  _Suggested description:_ “SaaS Entitlements & Licensing API (plans, features, limits, usage windows, whoami). NestJS + Prisma + PostgreSQL.”

- **Admin UI:** `toggleforge-entitlements-admin`  
  _Suggested description:_ “Admin dashboard for managing SaaS entitlements and usage. Next.js + Argon Dashboard + React Query.”

> If you prefer a mono-repo, keep both projects as siblings under a single workspace and link to this README at the root.

---

## 🧭 Overview

### Why this matters
- Turns feature flags into **monetizable access** (plans → features/limits).
- Demonstrates **multi-tenant** patterns, usage windowing, and clean **enforcement** via `/whoami`.
- Provides a clear **operator UX** for support, billing, and developer tooling.

### Architecture at a glance
```
/entitlements-api (NestJS)
  ├── Plans, Features, Metrics
  ├── Tenants, Assignments, Overrides
  ├── Usage windows (monthly)
  └── /whoami resolver (plan + limits)

/entitlements-admin (Next.js Argon)
  ├── Plans, Features CRUD
  ├── Tenants (assign plan)
  ├── Usage per tenant
  └── WhoAmI preview
```

---

## 🚀 Quick Start

> You can run API and UI as separate repos or sibling folders. Replace repo names/paths as needed.

### 1) Entitlements API (NestJS)

**Tech:** NestJS · Prisma · PostgreSQL · class‑validator · Swagger

**Environment** — `entitlements-api/.env`
```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_PUBLIC_KEY=dummy
```

**Database (Docker)**
```bash
docker run --name entitlements-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

**Install & DB setup**
```bash
cd entitlements-api
npm i
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

**Run API**
```bash
npm run start:dev
# API:  http://localhost:3001
# Docs: http://localhost:3001/docs
```

**Key Endpoints**
- `GET /plans` · `POST /plans`
- `GET /features` · `POST /features`
- `GET /tenants`
- `POST /entitlements/:tenantId` _(assign plan)_
- `GET /usage/:tenantId`
- `GET /whoami` _(resolved entitlements for default/demo tenant)_

**Data Model (Prisma)**
- `Plan`, `Feature`, `PlanFeature`
- `Tenant`, `TenantPlanAssignment`, `TenantFeatureOverride`
- `Metric`, `UsageCounter`

**Smoke Test**
```bash
curl http://localhost:3001/plans
curl -X POST http://localhost:3001/plans -H "Content-Type: application/json" -d '{"code":"test","name":"Test"}'
curl http://localhost:3001/features
curl http://localhost:3001/tenants
curl http://localhost:3001/whoami
curl http://localhost:3001/usage/t_acme
```

---

### 2) Admin UI (Next.js Argon)

**Tech:** Next.js (Pages Router) · Argon Dashboard · React Query · Axios · Zod · React Hook Form

**Environment** — `entitlements-admin/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Install & Run**
```bash
cd entitlements-admin
npm i
npm run dev
# UI: http://localhost:3000
```

**Pages**
- `/admin/plans`
- `/admin/features`
- `/admin/tenants`
- `/admin/usage`
- `/admin/whoami`

> If the demo dashboard uses charts/maps that access `window` during SSR, export it with `dynamic(..., { ssr: false })`.

**Implementation Notes**
- `lib/api.js`: SSR‑safe Axios baseURL; attach JWT in browser only.
- `hooks/useEntitlements.js`: React Query hooks with `enabled: typeof window !== 'undefined'`.
- `components/Sidebar/Sidebar.js`: grouped routes + “Entitlements” section.
- `routes.js`: avoid duplicates; keep auth pages off the admin sidebar.

---

## 📸 Screenshots

Click any image to open the high‑resolution version in a new tab.

<div align="center">
  <h4>Dashboard</h4>
  <a href="https://drive.google.com/file/d/1lpimaTBkjxRv2jo-2TRa1hLa9W7Q6Hlg/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1lpimaTBkjxRv2jo-2TRa1hLa9W7Q6Hlg" alt="Dashboard screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

<div align="center">
  <h4>Features</h4>
  <a href="https://drive.google.com/file/d/1b-GrEyqN9lAP_9wD8nHAWnvuldKEI4Y_/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1b-GrEyqN9lAP_9wD8nHAWnvuldKEI4Y_" alt="Features screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

<div align="center">
  <h4>Plans</h4>
  <a href="https://drive.google.com/file/d/1czO635qcr8e1oENac9zS-AFpmNuFlTM0/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1czO635qcr8e1oENac9zS-AFpmNuFlTM0" alt="Plans screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

<div align="center">
  <h4>Swagger</h4>
  <a href="https://drive.google.com/file/d/1aPb_C6jFsxvWAEaV5xA5AvcGZaNDs6EE/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1aPb_C6jFsxvWAEaV5xA5AvcGZaNDs6EE" alt="Swagger screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

<div align="center">
  <h4>Tenants</h4>
  <a href="https://drive.google.com/file/d/1gsy_p43AfodlGBMSbKP3eA_OIfxqlfj2/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1gsy_p43AfodlGBMSbKP3eA_OIfxqlfj2" alt="Tenants screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

<div align="center">
  <h4>Usage</h4>
  <a href="https://drive.google.com/file/d/1cNpmfrfnIn1p8kNmIVfddtdFUozntNfS/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1cNpmfrfnIn1p8kNmIVfddtdFUozntNfS" alt="Usage screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

<div align="center">
  <h4>WhoAmI</h4>
  <a href="https://drive.google.com/file/d/1reXtCQCcoT0Q0-KDE2v2VRnlCoIKihLv/view?usp=sharing" target="_blank" rel="noopener">
    <img src="https://drive.google.com/uc?export=view&id=1reXtCQCcoT0Q0-KDE2v2VRnlCoIKihLv" alt="WhoAmI screenshot" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px;" />
  </a>
</div>

---

## 🛡️ Security & Production Notes

- Add **real JWT verification** (public key) to protect admin routes.
- Validate and sign **webhooks** when billing is integrated.
- Apply per‑tenant **rate limiting** on mutating endpoints.
- Use **Redis** for atomic usage increments on the hot path.
- CI: run Prisma migrations and basic smoke tests on push.

---

## 🗺️ Roadmap

- [ ] Redis counters (`INCRBY` + monthly TTL keys)
- [ ] Stripe products/prices sync + webhooks
- [ ] Replayable usage events
- [ ] E2E flows (Playwright) and pact tests
- [ ] Multi‑env configs (dev/stage/prod) via env schema

---

## 📜 License

Copyright (c) 2025 earl-cod3

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

MIT © ToggleForge
