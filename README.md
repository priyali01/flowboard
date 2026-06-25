# FlowBoard

FlowBoard is a modern, full-stack Task Management application designed for dynamic and responsive task tracking. It is built as a monorepo containing a React frontend and an Express/Prisma backend.

## 🚀 Tech Stack

### Frontend (`apps/web`)
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Testing:** Vitest & React Testing Library

### Backend (`apps/api`)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT & bcrypt
- **Testing:** Jest & Supertest

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database Server:** PostgreSQL
- **Caching/Queue:** Redis

## 📂 Project Structure

```text
flowboard/
├── apps/
│   ├── web/        # React Frontend
│   └── api/        # Express Backend
├── packages/       # Shared libraries (future)
├── docker-compose.yml
├── package.json
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/priyali01/flowboard.git
   cd flowboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the infrastructure (PostgreSQL & Redis):**
   ```bash
   docker-compose up -d
   ```

4. **Setup the Database:**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development servers:**
   ```bash
   # From the root directory
   npm run dev
   ```

## 🧪 Testing

The project uses a Test-Driven Development (TDD) approach.

To run all tests:
```bash
npm run test
```

## 🛣️ Roadmap

- [x] **Stage 0:** Monorepo Setup & Foundation
- [x] **Stage 1:** Authentication (JWT, Register, Login)
- [x] **Stage 2:** Core Task & Project CRUD
- [x] **Stage 3:** Advanced Task Details, Subtasks, & Labels
- [ ] **Stage 4:** Search, Filtering, Sorting & Drag-and-Drop
- [ ] **Stage 5:** Comments, Attachments & Activity History
- [ ] **Stage 6:** Real-time Updates & Notifications

## 📝 License
MIT License
