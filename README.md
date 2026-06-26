<div align="center">

# ✅ FlowBoard-To-Do Application

**A modern, full-stack productivity tool for individuals and teams.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Docs](#-api-reference) · [Deployment](#-deployment) · [Contributing](#-contributing)

</div>

---

## 📖 About

The **To-Do Application** is a production-grade, full-stack task management platform designed for productivity at any scale — from a solo user capturing daily todos to a team coordinating project work in real time.

Built with a modern TypeScript monorepo, it ships as a **responsive web app**, an **offline-capable PWA**, and an **open REST + WebSocket API**.

### Highlights

- 🗂 **Projects & Lists** — organise tasks into colour-coded projects with drag-and-drop ordering
- ✅ **Rich Task Model** — titles, markdown descriptions, priorities, due dates, subtasks, labels, attachments, and comments
- 👥 **Team Collaboration** — invite members, assign tasks, set role-based permissions, and see updates in real time
- 🔔 **Notifications** — browser push, in-app bell, and daily email digest
- 📊 **Analytics** — completion charts, streak tracker, and CSV/PDF export
- 📱 **PWA + Offline** — install on any device; work offline and sync when reconnected
- 🌙 **Dark Mode** — system-aware with manual toggle
- ⌨️ **Keyboard Shortcuts** — power-user workflows without touching the mouse

---

## ✨ Features

### Core (MVP)

| Area | What's included |
|------|----------------|
| **Tasks** | Create, edit, complete, archive, delete; inline edit; drag-and-drop reorder |
| **Task fields** | Title, markdown description, status, priority (Low → Urgent), due date/time, labels, subtasks, attachments, comments |
| **Projects** | Multiple lists per user; Inbox default; colour + icon picker; archiving |
| **Labels** | User-defined, colour-coded; multi-label per task; filter by label |
| **Views** | Project view · Today · Upcoming (7 days) · Search |
| **Auth** | Register, login, email verification, forgot/reset password, secure sessions |

### Advanced (Post-MVP)

| Area | What's included |
|------|----------------|
| **Collaboration** | Workspace + member invites; roles (Owner / Admin / Member / Viewer); @mentions |
| **Real-time** | WebSocket sync — task changes appear instantly across all open tabs and teammates' browsers |
| **Recurring tasks** | Daily, weekly, monthly, and custom recurrence rules |
| **Templates** | Save and reuse task structures |
| **Bulk actions** | Complete, delete, move, or label multiple tasks at once |
| **Notifications** | Browser push · Email reminders · In-app bell |
| **Analytics** | Completed-per-day chart · Overdue count · Productivity streak · Export |
| **PWA** | Offline task creation queued in IndexedDB; auto-sync on reconnect |

---

## 🛠 Tech Stack

### Frontend

| | Technology |
|--|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query) |
| UI state | Zustand |
| Styling | Tailwind CSS + shadcn/ui |
| Forms | React Hook Form + Zod |
| Drag & Drop | @dnd-kit |
| Rich text | TipTap (WYSIWYG / Markdown) |
| Real-time | Socket.io-client |
| Animations | Framer Motion |
| PWA | Vite PWA Plugin (Workbox) |
| Testing | Vitest · React Testing Library · Playwright |

### Backend

| | Technology |
|--|-----------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Cache / Pub-Sub | Redis 7 |
| Auth | JWT (access) + Refresh tokens (httpOnly cookie) |
| File storage | AWS S3 / Cloudflare R2 |
| Email | Resend |
| Push | Web Push (VAPID) |
| Job queue | BullMQ |
| Logging | Winston + Morgan |
| API docs | OpenAPI 3.0 / Swagger |
| Testing | Jest · Supertest |

### Infrastructure

| | Technology |
|--|-----------|
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Frontend hosting | Vercel |
| Backend hosting | Railway / Render / AWS ECS |
| Database hosting | Supabase / AWS RDS |
| CDN | Cloudflare |
| Error tracking | Sentry |
| Analytics | PostHog |
| Uptime | Uptime Robot |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│         React Web App  ·  PWA (Offline)  ·  Mobile Browser     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    CDN / Edge (Cloudflare + Vercel)
                              │
                    API Gateway / LB (Nginx)
                    ┌─────────┴──────────┐
              REST API (Express)   WebSocket (Socket.io)
                    └─────────┬──────────┘
                       Business Logic
                    ┌──────────┴──────────┐
              PostgreSQL 15          Redis 7
              (primary + replica)    (cache · pub-sub · sessions)

              BullMQ workers — email · reminders · recurring tasks
              External — AWS S3 · Resend · Web Push · Sentry · PostHog
```

The frontend and backend share a `packages/validators` library (Zod schemas) and a `packages/types` library, so API contracts are enforced at compile time across both apps.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Docker + Docker Compose** (for local PostgreSQL and Redis)
- **pnpm** ≥ 9 (or npm / yarn)

### 1 — Clone & install

```bash
git clone https://github.com/your-org/todo-app.git
cd todo-app
pnpm install
```

### 2 — Environment variables

Copy the example files and fill in values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**`apps/api/.env` — minimum required:**

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me-to-a-long-random-string
JWT_REFRESH_SECRET=another-long-random-string
CORS_ORIGIN=http://localhost:5173
```

**`apps/web/.env` — minimum required:**

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

> Full variable reference in [Environment Variables](#-environment-variables).

### 3 — Start infrastructure

```bash
docker compose up -d        # starts PostgreSQL + Redis
```

### 4 — Database setup

```bash
cd apps/api
pnpm prisma migrate dev     # run migrations
pnpm prisma db seed         # optional: seed demo data
```

### 5 — Run the apps

```bash
# from repo root — starts both apps concurrently
pnpm dev
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:5173 |
| API | http://localhost:3000 |
| API docs (Swagger) | http://localhost:3000/docs |

---

## 📁 Project Structure

```
todo-app/
├── apps/
│   ├── web/                    # React + Vite frontend
│   │   └── src/
│   │       ├── components/     # UI components
│   │       ├── pages/          # Route-level pages
│   │       ├── hooks/          # Custom React hooks
│   │       ├── stores/         # Zustand stores
│   │       └── lib/            # Axios, socket, query client
│   └── api/                    # Express.js backend
│       ├── src/
│       │   ├── modules/        # Feature modules (tasks, auth, …)
│       │   ├── middleware/      # Auth, rate limit, error handler
│       │   ├── jobs/           # BullMQ job definitions
│       │   └── services/       # Email, storage, push
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
└── packages/
    ├── types/                  # Shared TypeScript types
    └── validators/             # Shared Zod schemas
```

---

## 🔌 API Reference

Base URL: `https://api.yourtodoapp.com/v1`

Interactive docs are available at `/docs` when running locally.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Login → JWT + refresh token |
| `POST` | `/auth/refresh` | Rotate access token |
| `POST` | `/auth/logout` | Revoke refresh token |
| `POST` | `/auth/forgot-password` | Send reset email |
| `POST` | `/auth/reset-password` | Reset with token |
| `GET` | `/auth/me` | Current user info |

### Tasks (selected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects/:id/tasks` | List tasks in project |
| `POST` | `/projects/:id/tasks` | Create task |
| `PATCH` | `/tasks/:id` | Update task |
| `PATCH` | `/tasks/:id/complete` | Toggle complete |
| `POST` | `/tasks/:id/move` | Move to different project |
| `GET` | `/tasks/today` | Tasks due today |
| `GET` | `/tasks/upcoming` | Next 7 days |
| `GET` | `/tasks/search?q=` | Full-text search |

Full endpoint list (projects, labels, comments, attachments, notifications, workspaces) is documented in [`plan.md`](./plan.md#8-api-design) and in the Swagger UI.

### WebSocket events

```
Client → Server    task:join · task:leave · project:join
Server → Client    task:created · task:updated · task:deleted
                   task:completed · comment:created · member:joined
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm test:unit

# Integration tests (requires Docker infra running)
pnpm test:integration

# E2E tests
pnpm test:e2e

# All tests + coverage report
pnpm test:coverage
```

**Coverage targets:** unit > 80% · integration > 70% · E2E covers all critical user paths.

---

## 🚢 Deployment

### Docker image

```bash
docker build -t todo-api ./apps/api
docker run -p 3000:3000 --env-file apps/api/.env todo-api
```

### Frontend (Vercel)

```bash
cd apps/web
vercel --prod
```

### Backend (Railway / Render)

Push to `main` — the GitHub Actions workflow builds, tests, migrates, and deploys automatically.

```
main   → Production  (yourtodoapp.com)
develop → Staging    (staging.yourtodoapp.com)
PR      → Preview URL
```

### Database migrations in CI

```bash
npx prisma migrate deploy   # runs before every production deploy
```

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 rounds)
- Access tokens expire in **15 minutes**; refresh tokens rotate on use
- Refresh tokens stored in **httpOnly, Secure, SameSite=Strict** cookies
- All endpoints protected by **Helmet.js** security headers
- **Rate limiting** — 100 req/min per user; 10 login attempts per 15 min per IP
- Input validated with **Zod** on every route; Prisma prevents SQL injection
- GDPR-compliant account deletion removes all user data
- `npm audit` runs in CI; Dependabot keeps dependencies patched

---

## 🌍 Environment Variables

### Backend (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server port (default `3000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_SECRET` | Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `CORS_ORIGIN` | Yes | Allowed frontend origin |
| `AWS_ACCESS_KEY_ID` | For uploads | S3/R2 key |
| `AWS_SECRET_ACCESS_KEY` | For uploads | S3/R2 secret |
| `S3_BUCKET_NAME` | For uploads | Bucket name |
| `RESEND_API_KEY` | For email | Resend API key |
| `VAPID_PUBLIC_KEY` | For push | Web Push VAPID key |
| `VAPID_PRIVATE_KEY` | For push | Web Push VAPID secret |
| `SENTRY_DSN` | For monitoring | Sentry error tracking URL |

### Frontend (`apps/web/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL |
| `VITE_SOCKET_URL` | Yes | WebSocket server URL |
| `VITE_VAPID_PUBLIC_KEY` | For push | Matches backend VAPID public key |
| `VITE_SENTRY_DSN` | For monitoring | Sentry DSN |
| `VITE_POSTHOG_KEY` | For analytics | PostHog project key |

---

## 🗺 Roadmap

| Version | Planned features |
|---------|-----------------|
| **v1.0** | Full MVP + team collaboration + PWA |
| **v1.1** | React Native mobile apps · Google Calendar sync · Slack integration · CSV import |
| **v1.2** | AI task prioritisation · Natural language input · Voice capture |
| **v1.3** | Public Kanban boards · Client portal · Stripe billing |
| **v2.0** | Tauri desktop app · Plugin API for third-party developers |

---

## 🤝 Contributing

Contributions are welcome! Please read the guidelines below before opening a PR.

1. **Fork** the repository and create a branch: `git checkout -b feat/your-feature`
2. Follow the existing code style (ESLint + Prettier — `pnpm lint`)
3. Write tests for new functionality
4. Ensure all tests pass: `pnpm test`
5. Open a Pull Request against `develop` with a clear description

### Commit convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add recurring task support
fix: correct due date timezone handling
docs: update API reference
chore: upgrade Prisma to 5.14
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 📬 Contact

Questions, ideas, or bug reports? Open an [issue](https://github.com/your-org/todo-app/issues) or start a [discussion](https://github.com/your-org/todo-app/discussions).

---

<div align="center">
Made with ☕ and TypeScript
</div>
