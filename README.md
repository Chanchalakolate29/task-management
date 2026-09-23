# Task & Team Management Platform

A full-stack Task & Team Management application built with React, Vite, Node.js, Express, and MongoDB. Includes JWT authentication, role-based access, drag-and-drop task boards, interactive analytics charts, and search/filter features.

---

## Live Demo & Deployment Links

- **Frontend (Vercel)**: [https://taskflow-platform.vercel.app](https://taskflow-platform.vercel.app)
- **Backend (Render)**: [https://taskflow-api.onrender.com](https://taskflow-api.onrender.com)
- **Database**: MongoDB Atlas

---

## Test Credentials

The backend automatically seeds two default test accounts on database initialization:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Standard User** | `testuser@example.com` | `Test@1234` | User |
| **Admin User** | `admin@example.com` | `Admin@1234` | Admin |

---

## Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, React Router DOM v6, Tailwind CSS, Axios, Recharts, `@hello-pangea/dnd`
- **Backend**: Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`
- **Testing**: Jest, Supertest, `mongodb-memory-server`
- **DevOps**: Docker, Docker Compose

---

## Repository Structure

```text
.
├── client/                 # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components (Navbar, Sidebar, TaskBoard, TaskCard, TaskModal, etc.)
│   │   ├── pages/          # Pages (Login, Register, Dashboard, TasksPage, NotFound)
│   │   ├── hooks/          # Custom hooks (useAuth, useTasks, useDarkMode)
│   │   ├── services/       # Axios API client setup
│   │   ├── store/          # Redux store and slices (authSlice, taskSlice, uiSlice)
│   │   ├── utils/          # Constants and validator helpers
│   │   ├── App.jsx         # Main router with lazy loading
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend API
│   ├── config/             # Database connection & seeder
│   ├── controllers/        # Route controllers (auth, task, user)
│   ├── middleware/         # Auth & error handling middleware
│   ├── models/             # Mongoose schemas (User, Task)
│   ├── routes/             # API routes
│   ├── tests/              # Jest integration test suite
│   ├── server.js           # Server entry point
│   └── package.json
│
├── docker-compose.yml      # Docker compose configuration
├── postman_collection.json # API collection for Postman/Bruno
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /register` - Create user account
- `POST /login` - Authenticate user & get JWT token

### Tasks
- `GET /tasks` - Retrieve tasks (supports `status`, `priority`, `search`, `sortBy`, `order`, `page`, `limit`)
- `GET /tasks/:id` - Get task details by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task by ID
- `DELETE /tasks/:id` - Delete task by ID

---

## Local Development Setup

### Option 1: Standard Setup

1. **Backend**:
   ```bash
   cd server
   npm install
   npm start
   ```
   *Runs on `http://localhost:5000`.*

2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:3000`.*

### Option 2: Docker Setup

Run the entire application using Docker Compose:

```bash
docker-compose up --build
```

---

## Running Unit Tests

Run the backend Jest integration tests:

```bash
cd server
npm test
```
