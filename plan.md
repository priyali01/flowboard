# 📋 To-Do Application — Complete Project Plan

> **Project Name:** To-Do Application  
> **Type:** Full-Stack Web + Mobile Application  
> **Document Version:** 1.0  
> **Status:** Planning Phase

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Objectives](#2-goals--objectives)
3. [Target Users](#3-target-users)
4. [Features](#4-features)
5. [Tech Stack](#5-tech-stack)
6. [System Architecture](#6-system-architecture)
7. [Database Schema](#7-database-schema)
8. [API Design](#8-api-design)
9. [Workflow & Development Phases](#9-workflow--development-phases)
10. [Folder Structure](#10-folder-structure)
11. [UI/UX Design Plan](#11-uiux-design-plan)
12. [Authentication & Authorization](#12-authentication--authorization)
13. [State Management](#13-state-management)
14. [Testing Strategy](#14-testing-strategy)
15. [Deployment Plan](#15-deployment-plan)
16. [CI/CD Pipeline](#16-cicd-pipeline)
17. [Security Plan](#17-security-plan)
18. [Performance Optimization](#18-performance-optimization)
19. [Monitoring & Observability](#19-monitoring--observability)
20. [Timeline & Milestones](#20-timeline--milestones)
21. [Risk & Mitigation](#21-risk--mitigation)
22. [Future Roadmap](#22-future-roadmap)

---

## 1. Project Overview

The **To-Do Application** is a modern, full-stack productivity tool that allows individual users and teams to create, manage, organize, and track tasks efficiently. It supports real-time collaboration, drag-and-drop task organization, priority management, deadline tracking, and multi-device synchronization.

The application will be available as:
- A **responsive web app** (desktop + mobile browser)
- A **Progressive Web App (PWA)** for offline use
- A **REST + WebSocket API** for third-party integrations

---

## 2. Goals & Objectives

### Primary Goals
- Allow users to create, read, update, and delete tasks (full CRUD)
- Organize tasks into projects, boards, or lists
- Set priorities, deadlines, reminders, and labels
- Support user authentication with secure sessions
- Enable real-time updates across devices

### Secondary Goals
- Team/collaborative task management
- Offline-first functionality (PWA + local storage sync)
- Notifications (browser push + email)
- Activity logs and history per task
- Dark mode support
- Keyboard shortcuts for power users

### Success Metrics
- Page load time < 2 seconds
- API response time < 200ms (p95)
- 99.9% uptime SLA
- Mobile Lighthouse score > 90
- Zero critical security vulnerabilities at launch

---

## 3. Target Users

| User Type | Description |
|-----------|-------------|
| Individual Users | Personal task and goal tracking |
| Students | Assignment and deadline management |
| Freelancers | Client task and project tracking |
| Small Teams | Collaborative task delegation |
| Managers | Task assignment and progress monitoring |

---

## 4. Features

### 4.1 Core Features (MVP)

#### Task Management
- Create tasks with title, description, due date, priority
- Mark tasks as complete / incomplete
- Delete and archive tasks
- Edit tasks inline or via modal
- Reorder tasks via drag-and-drop

#### Task Properties
- **Title** — required, max 255 chars
- **Description** — optional, rich text (markdown)
- **Priority** — Low, Medium, High, Urgent
- **Status** — Todo, In Progress, Done, Archived
- **Due Date** — date + optional time
- **Labels / Tags** — color-coded, user-defined
- **Attachments** — file uploads (images, PDFs)
- **Subtasks** — nested task lists
- **Notes / Comments** — thread per task

#### Lists & Projects
- Create multiple lists/projects
- Move tasks between lists
- Archive and delete lists
- Default "Inbox" list for quick capture

#### User Account
- Register, login, logout
- Profile management (name, avatar, timezone)
- Password change and reset
- Account deletion (GDPR-compliant)

### 4.2 Advanced Features (Post-MVP)

#### Collaboration
- Invite team members via email
- Assign tasks to team members
- Role-based permissions (Owner, Editor, Viewer)
- Real-time task updates via WebSockets
- @mention users in comments

#### Productivity
- Today view — tasks due today
- Upcoming view — tasks for the next 7 days
- Recurring tasks (daily, weekly, monthly, custom)
- Task templates
- Quick-add from anywhere (keyboard shortcut)
- Bulk actions (complete, delete, move, label)

#### Search & Filter
- Full-text search across all tasks and comments
- Filter by: status, priority, label, assignee, due date
- Sort by: due date, priority, created date, alphabetical
- Saved filters / smart lists

#### Notifications
- Browser push notifications
- Email reminders (daily digest, due soon)
- In-app notification bell
- Notification preferences per user

#### Analytics & Insights
- Tasks completed per day/week/month (charts)
- Overdue task count
- Productivity score
- Exportable reports (CSV, PDF)

#### Integrations (Future)
- Google Calendar sync
- Slack notifications
- GitHub Issues import
- Zapier / Make webhook triggers

---

## 5. Tech Stack

### Frontend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | **React 18** | Component model, large ecosystem |
| Language | **TypeScript** | Type safety, better DX |
| Routing | **React Router v6** | SPA routing |
| State Management | **Zustand** | Lightweight, simple API |
| Server State | **TanStack Query (React Query)** | Caching, sync, background refetch |
| Styling | **Tailwind CSS** | Utility-first, fast prototyping |
| Component Library | **shadcn/ui** | Accessible, customizable components |
| Forms | **React Hook Form + Zod** | Performant forms with schema validation |
| Drag & Drop | **@dnd-kit** | Accessible, keyboard-friendly DnD |
| Rich Text | **TipTap** | Markdown/WYSIWYG for descriptions |
| Icons | **Lucide React** | Clean, consistent icons |
| Animations | **Framer Motion** | Smooth transitions |
| Date Handling | **date-fns** | Lightweight date utilities |
| HTTP Client | **Axios** | Interceptors, error handling |
| WebSockets | **Socket.io-client** | Real-time features |
| PWA | **Vite PWA Plugin** | Service worker, offline support |
| Build Tool | **Vite** | Fast HMR, optimized builds |
| Testing | **Vitest + React Testing Library** | Unit and component tests |
| E2E Testing | **Playwright** | Browser automation |

### Backend
| Layer | Technology | Reason |
|-------|-----------|--------|
| Runtime | **Node.js 20 LTS** | JavaScript consistency, async I/O |
| Framework | **Express.js** | Minimal, flexible, well-known |
| Language | **TypeScript** | Shared types with frontend |
| ORM | **Prisma** | Type-safe DB queries, migrations |
| Database | **PostgreSQL 15** | Relational, ACID-compliant, JSON support |
| Cache | **Redis 7** | Session store, rate limiting, pub/sub |
| Auth | **JWT + Refresh Tokens** | Stateless, scalable |
| File Storage | **AWS S3 / Cloudflare R2** | Scalable object storage |
| Email | **Resend / Nodemailer + SES** | Transactional emails |
| Push Notifications | **Web Push (web-push library)** | Browser push support |
| Real-time | **Socket.io** | Rooms, namespaces, WebSocket fallback |
| Validation | **Zod** | Schema validation (shared with frontend) |
| Logging | **Winston + Morgan** | Structured logging |
| API Docs | **Swagger / OpenAPI 3.0** | Auto-generated docs |
| Testing | **Jest + Supertest** | Unit and integration tests |
| Task Queue | **BullMQ** | Background jobs (emails, reminders) |

### DevOps & Infrastructure
| Layer | Technology |
|-------|-----------|
| Containerization | **Docker + Docker Compose** |
| Container Orchestration | **Kubernetes (K8s) or Railway** |
| CI/CD | **GitHub Actions** |
| Frontend Hosting | **Vercel** |
| Backend Hosting | **Railway / Render / AWS ECS** |
| Database Hosting | **Supabase / AWS RDS** |
| CDN | **Cloudflare** |
| DNS | **Cloudflare DNS** |
| Secrets Management | **Doppler / AWS Secrets Manager** |
| Monitoring | **Sentry (errors) + Uptime Robot** |
| Analytics | **PostHog (self-hosted or cloud)** |
| Log Management | **Logtail / Papertrail** |

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────┐   ┌───────────────┐   ┌──────────────────┐  │
│  │  React Web   │   │  PWA (Offline)│   │  Mobile Browser  │  │
│  └──────┬───────┘   └───────┬───────┘   └────────┬─────────┘  │
└─────────┼───────────────────┼────────────────────┼────────────-┘
          │                   │                    │
          ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CDN / Edge Layer                         │
│                     (Cloudflare + Vercel)                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway / LB                         │
│                     (Nginx / Cloudflare)                        │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
       ┌───────▼──────┐              ┌────────▼─────┐
       │  REST API     │              │  WebSocket   │
       │  (Express.js) │              │  (Socket.io) │
       └───────┬───────┘              └────────┬─────┘
               │                              │
               └─────────────┬────────────────┘
                             │
              ┌──────────────▼──────────────────┐
              │         Business Logic           │
              │  (Services, Controllers, Jobs)   │
              └──────┬─────────────┬────────────┘
                     │             │
             ┌───────▼───┐  ┌──────▼──────┐
             │ PostgreSQL│  │   Redis      │
             │ (Primary  │  │  (Cache +    │
             │  + Read   │  │  Pub/Sub +   │
             │  Replica) │  │  Sessions)   │
             └───────────┘  └─────────────┘

              ┌────────────────────────────────┐
              │       Background Services       │
              │  BullMQ (Email, Reminders,      │
              │  Cleanup, Analytics Aggregation)│
              └────────────────────────────────┘

              ┌────────────────────────────────┐
              │        External Services        │
              │  AWS S3 · Resend · Web Push ·   │
              │  Sentry · PostHog               │
              └────────────────────────────────┘
```

---

## 7. Database Schema

### Users Table
```sql
users
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  email         VARCHAR(255) UNIQUE NOT NULL
  name          VARCHAR(100) NOT NULL
  avatar_url    TEXT
  timezone      VARCHAR(50) DEFAULT 'UTC'
  password_hash TEXT NOT NULL
  is_verified   BOOLEAN DEFAULT FALSE
  created_at    TIMESTAMPTZ DEFAULT NOW()
  updated_at    TIMESTAMPTZ DEFAULT NOW()
  deleted_at    TIMESTAMPTZ  -- soft delete
```

### Projects / Lists Table
```sql
projects
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
  owner_id    UUID REFERENCES users(id) ON DELETE CASCADE
  name        VARCHAR(100) NOT NULL
  color       VARCHAR(7)  -- hex color code
  icon        VARCHAR(50)
  is_inbox    BOOLEAN DEFAULT FALSE
  position    INTEGER DEFAULT 0
  created_at  TIMESTAMPTZ DEFAULT NOW()
  updated_at  TIMESTAMPTZ DEFAULT NOW()
  archived_at TIMESTAMPTZ
```

### Tasks Table
```sql
tasks
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE
  parent_id     UUID REFERENCES tasks(id)  -- for subtasks
  assignee_id   UUID REFERENCES users(id)
  created_by    UUID REFERENCES users(id)
  title         VARCHAR(255) NOT NULL
  description   TEXT  -- markdown
  status        task_status DEFAULT 'todo'  -- enum
  priority      task_priority DEFAULT 'medium'  -- enum
  position      INTEGER DEFAULT 0
  due_date      TIMESTAMPTZ
  due_time      TIME
  completed_at  TIMESTAMPTZ
  recurrence    JSONB  -- { type: 'weekly', days: ['Mon','Wed'] }
  created_at    TIMESTAMPTZ DEFAULT NOW()
  updated_at    TIMESTAMPTZ DEFAULT NOW()
  archived_at   TIMESTAMPTZ
  deleted_at    TIMESTAMPTZ

-- Enums
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'archived');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
```

### Labels Table
```sql
labels
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id    UUID REFERENCES users(id)
  name       VARCHAR(50) NOT NULL
  color      VARCHAR(7) NOT NULL
  created_at TIMESTAMPTZ DEFAULT NOW()

task_labels  -- junction table
  task_id  UUID REFERENCES tasks(id) ON DELETE CASCADE
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE
  PRIMARY KEY (task_id, label_id)
```

### Comments Table
```sql
comments
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
  task_id    UUID REFERENCES tasks(id) ON DELETE CASCADE
  user_id    UUID REFERENCES users(id)
  content    TEXT NOT NULL
  created_at TIMESTAMPTZ DEFAULT NOW()
  updated_at TIMESTAMPTZ DEFAULT NOW()
  deleted_at TIMESTAMPTZ
```

### Attachments Table
```sql
attachments
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
  task_id     UUID REFERENCES tasks(id) ON DELETE CASCADE
  uploaded_by UUID REFERENCES users(id)
  filename    VARCHAR(255) NOT NULL
  file_url    TEXT NOT NULL
  file_size   INTEGER NOT NULL  -- bytes
  mime_type   VARCHAR(100) NOT NULL
  created_at  TIMESTAMPTZ DEFAULT NOW()
```

### Team Members / Workspace Table
```sql
workspaces
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name       VARCHAR(100) NOT NULL
  owner_id   UUID REFERENCES users(id)
  created_at TIMESTAMPTZ DEFAULT NOW()

workspace_members
  workspace_id UUID REFERENCES workspaces(id)
  user_id      UUID REFERENCES users(id)
  role         member_role DEFAULT 'member'  -- owner, admin, member, viewer
  joined_at    TIMESTAMPTZ DEFAULT NOW()
  PRIMARY KEY (workspace_id, user_id)
```

### Activity Log Table
```sql
activity_logs
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
  task_id    UUID REFERENCES tasks(id) ON DELETE CASCADE
  user_id    UUID REFERENCES users(id)
  action     VARCHAR(50) NOT NULL  -- created, updated, completed, assigned, etc.
  meta       JSONB  -- diff or extra context
  created_at TIMESTAMPTZ DEFAULT NOW()
```

### Refresh Tokens Table
```sql
refresh_tokens
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE
  token      TEXT UNIQUE NOT NULL
  expires_at TIMESTAMPTZ NOT NULL
  revoked    BOOLEAN DEFAULT FALSE
  created_at TIMESTAMPTZ DEFAULT NOW()
```

---

## 8. API Design

### Base URL
```
https://api.yourtodoapp.com/v1
```

### Authentication Endpoints
```
POST   /auth/register          Register new user
POST   /auth/login             Login, returns JWT + refresh token
POST   /auth/logout            Revoke refresh token
POST   /auth/refresh           Get new access token
POST   /auth/forgot-password   Send reset email
POST   /auth/reset-password    Reset with token
GET    /auth/me                Get current user info
```

### User Endpoints
```
GET    /users/me               Get profile
PATCH  /users/me               Update profile
DELETE /users/me               Delete account
PATCH  /users/me/password      Change password
POST   /users/me/avatar        Upload avatar
```

### Project Endpoints
```
GET    /projects               List all projects
POST   /projects               Create project
GET    /projects/:id           Get project
PATCH  /projects/:id           Update project
DELETE /projects/:id           Delete project
PATCH  /projects/:id/archive   Archive project
PATCH  /projects/reorder       Reorder projects
```

### Task Endpoints
```
GET    /projects/:id/tasks     List tasks in project
POST   /projects/:id/tasks     Create task
GET    /tasks/:id              Get task
PATCH  /tasks/:id              Update task
DELETE /tasks/:id              Delete task
PATCH  /tasks/:id/complete     Toggle complete
PATCH  /tasks/:id/archive      Archive task
POST   /tasks/:id/move         Move to different project
PATCH  /tasks/reorder          Reorder tasks (drag-drop)
GET    /tasks/today            Tasks due today
GET    /tasks/upcoming         Tasks due in next 7 days
GET    /tasks/search           Full-text search tasks
```

### Subtask Endpoints
```
GET    /tasks/:id/subtasks     Get subtasks
POST   /tasks/:id/subtasks     Add subtask
PATCH  /tasks/:id/subtasks/:sid Update subtask
DELETE /tasks/:id/subtasks/:sid Delete subtask
```

### Comment Endpoints
```
GET    /tasks/:id/comments     List comments
POST   /tasks/:id/comments     Add comment
PATCH  /tasks/:id/comments/:cid Edit comment
DELETE /tasks/:id/comments/:cid Delete comment
```

### Label Endpoints
```
GET    /labels                 List user labels
POST   /labels                 Create label
PATCH  /labels/:id             Update label
DELETE /labels/:id             Delete label
POST   /tasks/:id/labels       Assign label to task
DELETE /tasks/:id/labels/:lid  Remove label from task
```

### Attachment Endpoints
```
POST   /tasks/:id/attachments          Upload file
GET    /tasks/:id/attachments          List attachments
DELETE /tasks/:id/attachments/:aid     Delete attachment
```

### Notification Endpoints
```
GET    /notifications              List notifications
PATCH  /notifications/read-all     Mark all as read
PATCH  /notifications/:id/read     Mark one as read
POST   /notifications/subscribe    Subscribe to push
DELETE /notifications/subscribe    Unsubscribe push
```

### WebSocket Events
```
Client → Server:
  task:join         Join a task room
  task:leave        Leave a task room
  project:join      Join a project room

Server → Client:
  task:created      New task created
  task:updated      Task was updated
  task:deleted      Task was removed
  task:completed    Task was completed
  comment:created   New comment added
  member:joined     Member joined project
```

---

## 9. Workflow & Development Phases

### Phase 0 — Setup & Foundation (Week 1)

**Goal:** Set up monorepo, tooling, CI, and base infrastructure.

- [ ] Initialize Git repository with monorepo structure (`/apps/web`, `/apps/api`)
- [ ] Configure TypeScript in both apps
- [ ] Set up ESLint, Prettier, and Husky pre-commit hooks
- [ ] Configure shared `packages/types` and `packages/validators` with Zod schemas
- [ ] Initialize Vite for frontend
- [ ] Initialize Express.js for backend with a `/health` endpoint
- [ ] Configure Docker and `docker-compose.yml` for local dev (PostgreSQL + Redis)
- [ ] Set up Prisma with initial migration
- [ ] Configure GitHub Actions workflow skeleton
- [ ] Set up `.env` files and document all required env vars

**Deliverables:**
- Running `docker compose up` starts the whole local stack
- Both apps run with hot reload
- Basic CI runs lint and type checks on PRs

---

### Phase 1 — Authentication (Week 2)

**Goal:** Secure user registration, login, logout, and token management.

- [ ] Implement `POST /auth/register` with email + password
- [ ] Hash passwords with bcrypt (12 rounds)
- [ ] Implement `POST /auth/login` — return access token (15min) + refresh token (30d)
- [ ] Implement `POST /auth/refresh` — rotate refresh tokens
- [ ] Implement `POST /auth/logout` — revoke refresh token
- [ ] Auth middleware for protected routes
- [ ] Forgot password flow (email token + reset endpoint)
- [ ] Frontend: Register page, Login page, Reset Password page
- [ ] Store access token in memory; refresh token in httpOnly cookie
- [ ] Email verification flow

**Deliverables:**
- User can register, verify email, login, and stay logged in across page refreshes

---

### Phase 2 — Core Task CRUD (Week 3–4)

**Goal:** Full task management features working end-to-end.

- [ ] Projects model and CRUD API
- [ ] Tasks model and full CRUD API
- [ ] Subtasks (nested tasks)
- [ ] Task status and priority fields
- [ ] Due date and time fields
- [ ] Frontend: Sidebar with project list
- [ ] Frontend: Task list view per project
- [ ] Frontend: Task creation form (quick-add + full modal)
- [ ] Frontend: Task detail panel / modal
- [ ] Frontend: Inline edit for title
- [ ] Frontend: Toggle task complete with animation
- [ ] Frontend: Delete task with confirmation

**Deliverables:**
- Full CRUD loop for tasks and projects in the browser

---

### Phase 3 — Organization & Productivity (Week 5)

**Goal:** Labels, drag-and-drop, filtering, search, Today/Upcoming views.

- [ ] Labels CRUD (backend + frontend color picker)
- [ ] Assign/remove labels on tasks
- [ ] Drag-and-drop reordering within a project (dnd-kit)
- [ ] Move tasks between projects (drag or context menu)
- [ ] Full-text search with debounce
- [ ] Filter panel (status, priority, label, due date)
- [ ] Sort options (due date, priority, created)
- [ ] Today view — tasks due today across all projects
- [ ] Upcoming view — next 7 days
- [ ] Keyboard shortcuts (n = new task, / = search, etc.)

**Deliverables:**
- Power user workflows functional; app feels fast and organized

---

### Phase 4 — Comments, Attachments & Activity (Week 6)

**Goal:** Task detail richness — discussion threads, files, history.

- [ ] Comments API and thread UI
- [ ] Markdown support in comments (TipTap)
- [ ] File upload to S3 / R2
- [ ] Attachment list in task detail
- [ ] Activity log feed per task (created, updated, completed events)
- [ ] Task description rich text (TipTap WYSIWYG)

**Deliverables:**
- Tasks are fully documented and traceable

---

### Phase 5 — Real-time & Notifications (Week 7)

**Goal:** Live updates across tabs/devices; push and email notifications.

- [ ] Socket.io server setup with auth middleware
- [ ] Join/leave project + task rooms
- [ ] Emit task events on create/update/delete/complete
- [ ] Frontend: receive and apply real-time diffs (React Query invalidation)
- [ ] Web Push notification subscription flow
- [ ] Send push on: task due soon, assigned task, comment mention
- [ ] Email notification service (BullMQ queue + Resend)
- [ ] Daily digest email (overdue + today's tasks)
- [ ] In-app notification bell + dropdown

**Deliverables:**
- Two browser tabs show the same data instantly without refresh

---

### Phase 6 — Team Collaboration (Week 8–9)

**Goal:** Workspaces, member management, task assignment.

- [ ] Workspace model and CRUD
- [ ] Invite members via email (token-based invite link)
- [ ] Role-based access control (Owner, Admin, Member, Viewer)
- [ ] Assign tasks to workspace members
- [ ] @mention autocomplete in comments
- [ ] Notify assignee when task assigned
- [ ] Shared project visibility within workspace
- [ ] Admin panel: manage members, roles, remove members

**Deliverables:**
- Teams can collaborate on shared projects with proper permissions

---

### Phase 7 — Recurring Tasks & Templates (Week 9)

**Goal:** Automation and recurring patterns.

- [ ] Recurrence rule model (RRULE-inspired: daily, weekly, monthly, custom)
- [ ] BullMQ cron job to create next task instance on completion
- [ ] Task templates — save a task structure for reuse
- [ ] Apply template to create pre-filled task

**Deliverables:**
- Repeating tasks auto-generate; routine workflows are templated

---

### Phase 8 — Analytics & Export (Week 10)

**Goal:** Insights dashboard and data export.

- [ ] Completed tasks per day / week chart (recharts)
- [ ] Overdue task count widget
- [ ] Project completion percentage
- [ ] Productivity streak tracker
- [ ] Export tasks as CSV
- [ ] Export tasks as PDF report

**Deliverables:**
- Users can visualize and export their productivity data

---

### Phase 9 — PWA & Offline Support (Week 10–11)

**Goal:** App works offline and installs on devices.

- [ ] Vite PWA Plugin with service worker
- [ ] Cache API responses with workbox strategies
- [ ] Offline task creation queued in IndexedDB
- [ ] Sync queue flushes when back online
- [ ] Install prompt for mobile home screen
- [ ] App manifest, icons, splash screen

**Deliverables:**
- App installs and works without internet; syncs when connected

---

### Phase 10 — Polish, Performance & Launch (Week 11–12)

**Goal:** Bug fixes, performance tuning, security audit, production deploy.

- [ ] Lighthouse audit and score > 90
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Dark mode implementation
- [ ] Skeleton loaders for all data states
- [ ] Empty states and onboarding tour
- [ ] Error boundaries and fallback UI
- [ ] Rate limiting on all API endpoints
- [ ] Security headers (helmet.js)
- [ ] Full E2E test coverage for critical paths
- [ ] Load testing with k6
- [ ] Production deploy and smoke tests

**Deliverables:**
- Publicly accessible, performant, secure production app

---

## 10. Folder Structure

### Frontend (`apps/web`)
```
apps/web/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskDragLayer.tsx
│   │   │   └── SubtaskList.tsx
│   │   ├── projects/
│   │   │   ├── ProjectList.tsx
│   │   │   └── ProjectForm.tsx
│   │   ├── comments/
│   │   │   └── CommentThread.tsx
│   │   ├── notifications/
│   │   │   └── NotificationBell.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useProjects.ts
│   │   ├── useSocket.ts
│   │   ├── useNotifications.ts
│   │   └── useSearch.ts
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── app/
│   │   │   ├── Inbox.tsx
│   │   │   ├── Today.tsx
│   │   │   ├── Upcoming.tsx
│   │   │   ├── Project.tsx
│   │   │   ├── Search.tsx
│   │   │   └── Analytics.tsx
│   │   └── settings/
│   │       ├── Profile.tsx
│   │       ├── Notifications.tsx
│   │       └── Account.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── syncStore.ts
│   ├── lib/
│   │   ├── api.ts             # Axios instance
│   │   ├── socket.ts          # Socket.io client
│   │   ├── queryClient.ts     # TanStack Query setup
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Backend (`apps/api`)
```
apps/api/
├── src/
│   ├── index.ts               # Entry point
│   ├── app.ts                 # Express app setup
│   ├── socket.ts              # Socket.io setup
│   ├── config/
│   │   ├── env.ts
│   │   ├── db.ts
│   │   └── redis.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts
│   │   ├── users/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── labels/
│   │   ├── comments/
│   │   ├── attachments/
│   │   └── notifications/
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── rateLimiter.ts
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── jobs/
│   │   ├── queue.ts
│   │   ├── emailJob.ts
│   │   ├── reminderJob.ts
│   │   └── recurringTaskJob.ts
│   ├── services/
│   │   ├── email.service.ts
│   │   ├── storage.service.ts
│   │   └── push.service.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── logger.ts
│   │   └── helpers.ts
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
│   ├── unit/
│   └── integration/
└── tsconfig.json
```

### Shared Packages (`packages/`)
```
packages/
├── types/
│   ├── src/
│   │   ├── task.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   └── package.json
└── validators/
    ├── src/
    │   ├── task.schema.ts
    │   ├── auth.schema.ts
    │   └── project.schema.ts
    └── package.json
```

---

## 11. UI/UX Design Plan

### Design System
- **Primary Color:** Indigo `#6366F1`
- **Accent Color:** Emerald `#10B981`
- **Danger:** Red `#EF4444`
- **Warning:** Amber `#F59E0B`
- **Font:** Inter (body) + JetBrains Mono (code)
- **Border Radius:** 8px (cards), 4px (inputs)
- **Spacing Scale:** 4px base unit (Tailwind default)

### Priority Color Coding
| Priority | Color |
|----------|-------|
| Urgent | Red `#EF4444` |
| High | Orange `#F97316` |
| Medium | Blue `#3B82F6` |
| Low | Gray `#9CA3AF` |

### Key Views

**Sidebar (Desktop)**
- Logo + workspace switcher
- Inbox (default)
- Today
- Upcoming
- Project list (collapsible)
- Labels list
- Settings

**Task List View**
- Task rows with: checkbox, title, due date badge, priority dot, label chips, assignee avatar
- Quick-add bar at top/bottom
- Drag handle for reordering

**Task Detail Panel (Side panel on desktop, full page on mobile)**
- Title (inline editable)
- Description (TipTap editor)
- Properties: status, priority, due date, assignee, labels
- Subtask checklist
- Attachment dropzone
- Comment thread
- Activity log at bottom

**Today / Upcoming View**
- Grouped by project with headers
- Overdue section at top (red)
- Empty state with motivational illustration

### Responsive Breakpoints
| Breakpoint | Behavior |
|-----------|---------|
| Mobile (< 640px) | Single column; sidebar as bottom drawer |
| Tablet (640–1024px) | Collapsible sidebar; task detail as modal |
| Desktop (> 1024px) | 3-column: sidebar, task list, detail panel |

---

## 12. Authentication & Authorization

### Token Strategy
- **Access Token:** JWT, short-lived (15 minutes), stored in memory (React state/zustand)
- **Refresh Token:** Opaque random string (UUID), 30 days, stored in httpOnly secure cookie
- On page load → silently call `/auth/refresh` to get new access token
- Axios interceptor: on 401, attempt refresh, retry request, else redirect to login

### RBAC (Role-Based Access Control)
| Role | Create Task | Edit Task | Delete Task | Manage Members | Billing |
|------|------------|-----------|-------------|---------------|---------|
| Viewer | ✗ | ✗ | ✗ | ✗ | ✗ |
| Member | ✓ | Own only | Own only | ✗ | ✗ |
| Admin | ✓ | All | All | ✓ | ✗ |
| Owner | ✓ | All | All | ✓ | ✓ |

### Email Verification
- Send token via email on register
- `/auth/verify-email?token=...` marks user as verified
- Protected routes require `is_verified = true`

---

## 13. State Management

### Client-Side State Architecture

| State Type | Tool | Examples |
|-----------|------|---------|
| Server state | TanStack Query | Tasks list, user profile |
| UI state | Zustand | Sidebar open, modal open, theme |
| Form state | React Hook Form | Task form, login form |
| URL state | React Router | Project ID, filter params |
| Offline queue | IndexedDB (idb) | Pending creates/updates |

### TanStack Query Key Conventions
```typescript
['projects']                           // all projects
['project', projectId]                 // single project
['tasks', projectId]                   // tasks in project
['tasks', 'today']                     // today's tasks
['task', taskId]                       // single task
['task', taskId, 'comments']           // task comments
['labels']                             // all labels
```

---

## 14. Testing Strategy

### Unit Tests (Vitest / Jest)
- All utility functions and helpers
- Zod schema validations
- Business logic services (task service, auth service)
- React hooks (`useTasks`, `useAuth`)

### Integration Tests (Supertest)
- All API endpoints with real database (test DB)
- Auth flows (register → verify → login → refresh → logout)
- CRUD flows for tasks, projects, labels
- Permission enforcement tests

### Component Tests (React Testing Library)
- Task item render and interactions
- Form validation behavior
- Modal open/close behavior

### E2E Tests (Playwright)
- User register → verify → login
- Create project → add tasks → complete tasks
- Drag-and-drop reorder
- Search and filter
- Team invite flow

### Performance Tests (k6)
- 100 concurrent users creating/listing tasks
- API response time p95 < 200ms
- WebSocket connection under load

### Test Coverage Target
- Unit: > 80%
- Integration: > 70%
- E2E: critical user paths (100%)

---

## 15. Deployment Plan

### Environments

| Environment | Purpose | Deploy Trigger |
|------------|---------|---------------|
| Local | Development | Manual |
| Preview | PR review | PR opened/updated |
| Staging | QA testing | Merge to `develop` |
| Production | Live users | Merge to `main` + manual approval |

### Frontend Deployment (Vercel)
```
main → Production (yourtodoapp.com)
develop → Staging (staging.yourtodoapp.com)
PR branch → Preview URL
```

### Backend Deployment (Railway / Render / AWS)

**Docker image build:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Environment Variables (Production)**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
RESEND_API_KEY=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
SENTRY_DSN=...
CORS_ORIGIN=https://yourtodoapp.com
NODE_ENV=production
```

### Database Migrations
```bash
# In CI before deploy:
npx prisma migrate deploy
```

### Zero-Downtime Deploy Strategy
- Use rolling deployments on Railway/ECS
- Run DB migrations separately before app deploy
- Health check endpoint: `GET /health` returns `{ status: "ok", db: "ok", redis: "ok" }`
- Rollback: keep previous image tag, redeploy on failure

---

## 16. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml

Triggers: push to main/develop, PR to main/develop

Jobs:
  lint-and-type-check:
    - Checkout code
    - Install dependencies
    - Run ESLint
    - Run TypeScript check

  unit-tests:
    - Run Vitest (frontend)
    - Run Jest (backend)
    - Upload coverage to Codecov

  integration-tests:
    - Spin up PostgreSQL + Redis via services
    - Run Prisma migrate
    - Run Supertest API tests

  e2e-tests:
    - Build app
    - Start frontend + backend
    - Run Playwright tests
    - Upload test artifacts on failure

  build:
    - Build frontend (Vite)
    - Build backend (tsc)
    - Build Docker image
    - Push to container registry

  deploy-staging:
    - Only on develop branch
    - Deploy to Railway staging

  deploy-production:
    - Only on main branch
    - Manual approval gate
    - Run DB migrations
    - Deploy to Railway production
    - Run smoke tests
    - Notify Slack on success/failure
```

---

## 17. Security Plan

### Input Validation
- All API inputs validated with Zod schemas before processing
- SQL injection prevention via Prisma parameterized queries
- XSS prevention: sanitize markdown output with DOMPurify on frontend

### Authentication Security
- bcrypt password hashing (12 rounds)
- Refresh tokens hashed in DB (store hash, send raw)
- httpOnly + Secure + SameSite=Strict cookies for refresh tokens
- Rate limit login: 10 attempts per 15 minutes per IP

### API Security
- Helmet.js for security headers (CSP, HSTS, X-Frame-Options)
- CORS restricted to known origins
- Rate limiting: 100 req/min per user (Redis-based)
- Request size limit: 10MB max
- File upload: validate MIME type + scan with ClamAV (optional)

### Data Privacy
- Password never stored or logged in plaintext
- PII fields encrypted at rest in DB (email)
- GDPR: account deletion removes all user data
- Audit logs for sensitive operations

### Dependency Security
- `npm audit` in CI pipeline
- Dependabot / Renovate for automated security updates
- Lock files committed (`package-lock.json`)

---

## 18. Performance Optimization

### Frontend
- Code splitting by route (React.lazy + Suspense)
- Image optimization (WebP, lazy loading)
- Virtual list for large task lists (TanStack Virtual)
- Debounce search input (300ms)
- Optimistic UI updates (React Query mutations)
- Service worker caching (workbox strategies)
- Preload critical fonts

### Backend
- Database indexes on: `tasks.project_id`, `tasks.due_date`, `tasks.status`, `tasks.assignee_id`, `tasks.created_at`
- Pagination on all list endpoints (cursor-based)
- Redis caching for frequently read data (user profile, project list)
- Database connection pooling (PgBouncer or Prisma pool)
- Compression: gzip/brotli via Nginx
- Background jobs off the request thread (BullMQ)

### Database
- Read replicas for analytics queries
- EXPLAIN ANALYZE on slow queries
- Vacuum and analyze scheduled

---

## 19. Monitoring & Observability

### Error Tracking — Sentry
- Frontend: capture unhandled exceptions and React error boundaries
- Backend: capture unhandled promise rejections and Express errors
- Source maps uploaded for readable stack traces
- Alert on new issues or spike in error rate

### Uptime Monitoring — Uptime Robot / Better Stack
- Check `GET /health` every 60 seconds
- Alert via email + Slack if down

### Application Metrics
- Custom metrics: tasks created per day, active users, API response times
- Export to Grafana via Prometheus (optional advanced setup)

### Logging — Winston + Logtail
```
[INFO]  Request: GET /api/tasks 200 45ms user=abc123
[WARN]  Rate limit hit: ip=1.2.3.4 endpoint=/auth/login
[ERROR] DB query failed: connection timeout taskId=xyz
```

### Alerting Rules
| Alert | Condition | Channel |
|-------|-----------|---------|
| API down | /health returns non-200 | PagerDuty + Slack |
| Error spike | >50 errors/min | Slack |
| Slow API | p95 > 500ms | Slack |
| DB connection pool full | >90% utilization | Slack |
| Disk space | >80% | Email |

---

## 20. Timeline & Milestones

| Milestone | Week | Deliverable |
|-----------|------|------------|
| M0 — Foundation | 1 | Monorepo, Docker, DB, CI skeleton |
| M1 — Auth | 2 | Register, login, tokens, email verify |
| M2 — Core CRUD | 4 | Full task + project management |
| M3 — Organization | 5 | Labels, drag-drop, search, filters |
| M4 — Rich Tasks | 6 | Comments, attachments, activity |
| M5 — Real-time | 7 | WebSockets, push, email notifications |
| M6 — Teams | 9 | Workspaces, invite, roles, assignment |
| M7 — Automation | 9 | Recurring tasks, templates |
| M8 — Analytics | 10 | Charts, insights, export |
| M9 — PWA | 11 | Offline support, installable |
| M10 — Launch | 12 | Production deploy, security audit |

**Total estimated duration: 12 weeks (3 months)**

---

## 21. Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Scope creep | High | High | Lock MVP scope; defer advanced features |
| Real-time complexity | Medium | Medium | Use Socket.io fallbacks; test thoroughly |
| DB performance at scale | Low | High | Index early; add read replicas if needed |
| Third-party API limits | Medium | Low | Abstract services; add fallbacks |
| Security breach | Low | Critical | Security audit before launch; pen test |
| Team delays | Medium | High | Buffer time in each phase; daily standups |
| Cloud cost overrun | Low | Medium | Set billing alerts; start with free tiers |

---

## 22. Future Roadmap

### v1.1
- Mobile apps (React Native)
- Google Calendar two-way sync
- Slack integration (create tasks from messages)
- CSV import of tasks

### v1.2
- AI features: auto-prioritize tasks, suggest due dates, summarize task history
- Natural language task creation ("Remind me to call John on Friday at 3pm")
- Voice input

### v1.3
- Public task boards (Kanban view, shareable link)
- Client portal for freelancers
- Billing / subscription system (Stripe)
- White-label / team branding

### v2.0
- Native desktop app (Tauri)
- Offline-first mobile with full conflict resolution
- Plugin/extension API for third-party developers

---

## Appendix A — Environment Variables Reference

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_VAPID_PUBLIC_KEY=...
VITE_SENTRY_DSN=...
VITE_POSTHOG_KEY=...
```

### Backend (`.env`)
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/todo_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-very-secure-secret
JWT_REFRESH_SECRET=another-very-secure-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:5173
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=todo-app-uploads
RESEND_API_KEY=...
EMAIL_FROM=noreply@yourtodoapp.com
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
SENTRY_DSN=...
```

---

## Appendix B — Recommended Libraries Summary

```json
{
  "frontend": {
    "react": "^18.3",
    "typescript": "^5.4",
    "vite": "^5.0",
    "@tanstack/react-query": "^5.0",
    "zustand": "^4.5",
    "react-hook-form": "^7.51",
    "zod": "^3.22",
    "@dnd-kit/core": "^6.1",
    "framer-motion": "^11.0",
    "tailwindcss": "^3.4",
    "@tiptap/react": "^2.4",
    "date-fns": "^3.6",
    "axios": "^1.7",
    "socket.io-client": "^4.7",
    "lucide-react": "^0.383",
    "recharts": "^2.12"
  },
  "backend": {
    "express": "^4.19",
    "typescript": "^5.4",
    "prisma": "^5.14",
    "@prisma/client": "^5.14",
    "bcrypt": "^5.1",
    "jsonwebtoken": "^9.0",
    "zod": "^3.22",
    "socket.io": "^4.7",
    "bullmq": "^5.8",
    "ioredis": "^5.3",
    "multer": "^1.4",
    "@aws-sdk/client-s3": "^3.0",
    "resend": "^3.2",
    "web-push": "^3.6",
    "helmet": "^7.1",
    "express-rate-limit": "^7.3",
    "winston": "^3.13",
    "morgan": "^1.10"
  }
}
```

---

*Last updated: June 2026 — Project: To-Do Application*
