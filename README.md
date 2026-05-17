# Task Management — Full-Stack Application

A full-stack task management system with role-based access control, real-time updates, file attachments, and email verification.

## Tech Stack

| Layer       | Technology                                                                |
| ----------- | ------------------------------------------------------------------------- |
| Frontend    | React 19, Vite, Zustand, React Router v7, Tailwind CSS, Framer Motion    |
| Backend     | Node.js, Express 5, Mongoose (MongoDB), Socket.IO, Swagger/OpenAPI       |
| Auth        | JWT (HTTP-only cookies), bcryptjs, email verification via Nodemailer      |
| File Upload | Cloudinary (via Multer)                                                   |
| Testing     | Jest + Supertest (backend), Vitest + React Testing Library (frontend)     |
| DevOps      | Docker, Docker Compose, Nginx, multi-stage Dockerfiles                   |

---

## Features

- **Authentication & Authorization** — Signup, login, logout with JWT stored in HTTP-only cookies. Role-based access (`user` / `admin`).
- **Email Verification** — 6-digit OTP sent via Nodemailer; accounts remain unverified until confirmed.
- **Password Reset** — Forgot-password flow with tokenised reset links sent via email.
- **Task CRUD** — Create, read, update, and delete tasks with title, description, status (`todo`, `in-progress`, `done`), priority (`low`, `medium`, `high`), due date, and assignee.
- **File Attachments** — Upload up to 3 PDF documents per task, stored on Cloudinary.
- **Filtering, Sorting & Pagination** — Server-side query support for status, priority, due-date range, search text, sort field, and sort order.
- **Real-Time Updates** — Socket.IO pushes task changes to connected clients instantly.
- **Admin Panel** — Dashboard stats, user management (list/search/create/update role/delete), and the ability to view all tasks across users.
- **Profile Management** — Users can update their name, bio, phone number, and profile image.
- **API Documentation** — Interactive Swagger UI available at `/api/docs`.
- **Security** — Helmet, CORS whitelist, rate limiting, input validation (express-validator + Joi).

---

## Project Structure

```
TASK-MANAGEMENT/
├── backend/
│   ├── config/            # DB, Cloudinary, email, Socket.IO, Swagger configs
│   ├── controllers/       # Route handlers (auth, task, user, admin, upload)
│   ├── mailer/            # Email templates and transport
│   ├── middleware/         # verifyAuth, verifyAdmin, multer upload
│   ├── models/            # Mongoose schemas (User, Task)
│   ├── routes/            # Express routers with Swagger annotations
│   ├── services/          # Cloudinary service
│   ├── utils/             # JWT helper, misc utilities
│   ├── __tests__/         # Unit & integration tests (Jest)
│   ├── test-utils/        # Test setup helpers
│   ├── app.js             # Express app configuration
│   ├── server.js          # HTTP server + Socket.IO bootstrap
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (auth, tasks, admin, layout, home)
│   │   ├── hooks/         # Custom hooks (useAuth, useSocket, useTasks, etc.)
│   │   ├── layouts/       # MainLayout wrapper
│   │   ├── pages/         # Route-level pages (auth, tasks, admin, home)
│   │   ├── routes/        # ProtectedRoute & AdminRoute guards
│   │   ├── services/      # Axios API client and service modules
│   │   ├── store/         # Zustand stores (authStore, taskStore)
│   │   ├── tests/         # Component tests (Vitest)
│   │   └── App.jsx        # Root component with routing
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local instance or Atlas URI)
- **Cloudinary** account (for file uploads)
- **SMTP credentials** (e.g. Gmail App Password — for email features)
- **Docker & Docker Compose** (optional, for containerised setup)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd TASK-MANAGEMENT
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env          # fill in the values below
npm install
npm run dev                   # starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## Environment Variables

Create `backend/.env` using the template below:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=<strong-random-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Email (Gmail example)
EMAIL_USER=<your-email@gmail.com>
EMAIL_APP_PASSWORD=<your-app-password>
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
MAX_FILES_PER_TASK=3
```

---

## Docker

Run the entire stack (MongoDB + Backend + Frontend) with a single command:

```bash
docker compose up --build
```

| Service  | Port |
| -------- | ---- |
| Frontend | 80   |
| Backend  | 5000 |
| MongoDB  | 27017|

Both Dockerfiles use multi-stage builds to keep images small. The frontend is served via Nginx in production.

---

## API Endpoints

Interactive docs are at **`http://localhost:5000/api/docs`** (Swagger UI).

### Auth — `/api/auth`

| Method | Path                      | Description             | Access  |
| ------ | ------------------------- | ----------------------- | ------- |
| POST   | `/signup`                 | Register                | Public  |
| POST   | `/login`                  | Login                   | Public  |
| POST   | `/logout`                 | Logout                  | Public  |
| POST   | `/verify-email`           | Verify email with OTP   | Public  |
| POST   | `/forgot-password`        | Request password reset  | Public  |
| POST   | `/reset-password/:token`  | Reset password          | Public  |
| GET    | `/check-auth`             | Check session           | Auth    |
| PUT    | `/profile`                | Update own profile      | Auth    |

### Tasks — `/api/tasks`

| Method | Path                          | Description                     | Access |
| ------ | ----------------------------- | ------------------------------- | ------ |
| GET    | `/`                           | List tasks (paginated/filtered) | Auth   |
| POST   | `/`                           | Create task (with files)        | Auth   |
| GET    | `/:id`                        | Get task by ID                  | Auth   |
| PUT    | `/:id`                        | Update task (with files)        | Auth   |
| DELETE | `/:id`                        | Delete task                     | Auth   |
| GET    | `/:id/documents/:docId`       | Download attachment             | Auth   |

### Users — `/api/users`

| Method | Path    | Description      | Access       |
| ------ | ------- | ---------------- | ------------ |
| GET    | `/`     | List users       | Admin        |
| POST   | `/`     | Create user      | Admin        |
| GET    | `/:id`  | Get user profile | Admin / Self |
| PUT    | `/:id`  | Update user      | Admin / Self |
| DELETE | `/:id`  | Delete user      | Admin        |

### Admin — `/api/admin`

| Method | Path               | Description           | Access |
| ------ | ------------------ | --------------------- | ------ |
| GET    | `/stats`           | Dashboard statistics  | Admin  |
| GET    | `/statistics`      | User statistics       | Admin  |
| GET    | `/users`           | List all users        | Admin  |
| GET    | `/users/search`    | Search users          | Admin  |
| GET    | `/users/:id`       | User details          | Admin  |
| PUT    | `/users/:id/role`  | Update user role      | Admin  |
| DELETE | `/users/:id`       | Delete user           | Admin  |
| GET    | `/admins`          | List all admins       | Admin  |

### Other

| Method | Path            | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/health`       | Health check       |
| POST   | `/api/upload`   | Upload file        |

---

## Testing

### Backend

```bash
cd backend
npm test                    # run all tests
npm run test:unit           # unit tests with coverage
npm run test:integration    # integration tests
npm run test:coverage       # full coverage report
```

Coverage threshold is set to **80 %** across branches, functions, lines, and statements.

### Frontend

```bash
cd frontend
npm run lint                # ESLint
npx vitest run              # run component tests
```

---

## Scripts Reference

### Backend (`backend/package.json`)

| Script           | Command                              |
| ---------------- | ------------------------------------ |
| `dev`            | `cross-env NODE_ENV=development nodemon server.js` |
| `start`          | `node server.js`                     |
| `test`           | `jest`                               |
| `test:unit`      | `jest --coverage`                    |
| `test:integration` | `jest --testPathPattern=__tests__/integration` |
| `lint`           | `eslint .`                           |
| `format`         | `prettier --write .`                 |

### Frontend (`frontend/package.json`)

| Script    | Command          |
| --------- | ---------------- |
| `dev`     | `vite`           |
| `build`   | `vite build`     |
| `preview` | `vite preview`   |
| `lint`    | `eslint .`       |
