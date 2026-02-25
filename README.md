# TodoList — Full-Stack Task Management App

A full-stack task management application built with **Laravel 12** (API backend) and **React 19** (frontend SPA). Features session-based authentication via Laravel Sanctum, full CRUD for todos and categories, real-time optimistic updates, global search, dark/light theme, and a responsive dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.2+, Laravel 12, Laravel Sanctum |
| Database | MySQL (primary) / SQLite (fallback) |
| Frontend | React 19, JavaScript (ES Modules), Vite 7 |
| State | TanStack React Query 5 |
| Routing | React Router 7 |
| HTTP | Axios |
| Styling | Tailwind CSS 4, CSS Modules |

---

## Features

- **Authentication** — Register, login, logout with session-based auth (Sanctum SPA)
- **Todos** — Create, read, update, delete tasks with soft deletes
- **Categories** — Group tasks by custom categories with color and icon
- **Priority levels** — Low / Medium / High
- **Due dates** — Track upcoming, today, and overdue tasks
- **Toggle completion** — Optimistic updates for instant UI feedback
- **Filtering & search** — Filter by status (all / active / completed), global full-text search
- **Statistics dashboard** — Counts for total, pending, completed, overdue tasks
- **Dark / Light theme** — Persisted via localStorage
- **Responsive sidebar** — Quick access to Dashboard, Today, Upcoming, Overdue, Completed views

---

## Project Structure

```
todolist/
├── backend/          # Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   # AuthController, TodoController, CategoryController
│   │   │   ├── Requests/          # Form request validators
│   │   │   └── Resources/         # API response transformers
│   │   ├── Models/                # User, Todo, Category
│   │   └── Policies/              # Authorization policies
│   ├── database/
│   │   └── migrations/            # DB schema
│   └── routes/
│       └── api.php                # API routes
│
├── frontend/         # React + JavaScript SPA
│   └── src/
│       ├── components/layout/     # MainLayout, Sidebar, Header, SearchBox, CategoryModal
│       ├── contexts/              # AuthContext
│       ├── hooks/                 # useDarkMode
│       ├── lib/                   # axios, queryClient, queryKeys, todoApi
│       ├── pages/
│       │   ├── auth/              # LoginPage, RegisterPage
│       │   └── todos/             # TodosPage, TodoItem, TodoModal, StatsCards
│       └── router/                # index, ProtectedRoute, GuestRoute
│
└── documents/        # Project guides and documentation
```

---

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL (or use SQLite for quick start)
- XAMPP / Laravel Herd / any local server

---

## Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd todolist
```

### 2. Backend setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file and configure
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todolist
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_DOMAIN=localhost

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

FRONTEND_URL=http://localhost:5173
```

```bash
# Run migrations
php artisan migrate

# Start the development server
php artisan serve
# → http://127.0.0.1:8000
```

### 3. Frontend setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

```bash
# Start the development server
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Backend URL | `http://127.0.0.1:8000` |
| `DB_CONNECTION` | Database driver | `mysql` |
| `DB_DATABASE` | Database name | `todolist` |
| `SESSION_DRIVER` | Session storage | `database` |
| `SESSION_DOMAIN` | Session cookie domain | `localhost` |
| `SANCTUM_STATEFUL_DOMAINS` | Allowed SPA origins | `localhost:5173` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://127.0.0.1:8000` |

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require an active session (cookie-based).

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | — | Register a new user |
| `POST` | `/api/login` | — | Login |
| `POST` | `/api/logout` | Yes | Logout |
| `GET` | `/api/user` | Yes | Get current user |

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos` | List todos (filter, search, paginate) |
| `POST` | `/api/todos` | Create a todo |
| `GET` | `/api/todos/{id}` | Get a single todo |
| `PATCH` | `/api/todos/{id}` | Update a todo |
| `DELETE` | `/api/todos/{id}` | Soft-delete a todo |
| `PATCH` | `/api/todos/{id}/toggle` | Toggle completion status |
| `POST` | `/api/todos/bulk-delete` | Bulk delete |
| `POST` | `/api/todos/bulk-complete` | Bulk complete |

#### Query parameters for `GET /api/todos`

| Parameter | Values | Description |
|-----------|--------|-------------|
| `status` | `pending` \| `completed` \| `overdue` \| `due_today` | Filter by status |
| `category_id` | integer | Filter by category |
| `priority` | `1` \| `2` \| `3` | Filter by priority |
| `search` | string | Search in title |
| `sort_by` | `created_at` \| `due_date` \| `priority` \| `title` | Sort field |
| `sort_dir` | `asc` \| `desc` | Sort direction |
| `per_page` | integer (max 100) | Items per page |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | List all categories (with pending count) |
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories/{id}` | Get a category |
| `PATCH` | `/api/categories/{id}` | Update a category |
| `DELETE` | `/api/categories/{id}` | Delete a category |

### Response format

```json
{
  "data": { },
  "message": "Created successfully"
}
```

Paginated lists:

```json
{
  "data": [ ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 20,
    "total": 45
  }
}
```

---

## Data Models

### Todo

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Primary key |
| `user_id` | integer | Owner |
| `category_id` | integer\|null | Optional category |
| `title` | string | Task title |
| `description` | text\|null | Optional details |
| `priority` | 1\|2\|3 | Low / Medium / High |
| `due_date` | date\|null | Deadline |
| `is_completed` | boolean | Completion status |
| `completed_at` | timestamp\|null | When completed |

Computed fields returned by the API: `priority_label`, `is_overdue`, `status`.

### Category

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Primary key |
| `user_id` | integer | Owner |
| `name` | string | Category name (unique per user) |
| `color` | string | Hex color (default `#3B82F6`) |
| `icon` | string\|null | Optional icon identifier |

Computed field: `pending_count`.

---

## Authentication Flow

The app uses **Laravel Sanctum SPA authentication** (cookie/session based — no tokens in localStorage).

1. Frontend calls `GET /sanctum/csrf-cookie` to obtain a CSRF token
2. User submits login form → `POST /api/login`
3. Laravel creates a session and sets a `session` cookie + `XSRF-TOKEN` cookie
4. Axios automatically reads `XSRF-TOKEN` and sends it as `X-XSRF-TOKEN` header on every request
5. On page reload, `GET /api/user` restores the session state
6. `POST /api/logout` invalidates the session

---

## Frontend Architecture

### State management layers

| Layer | Tool | Responsibility |
|-------|------|---------------|
| Server state | TanStack React Query | Fetching, caching, invalidation |
| Auth state | React Context | Current user, login/logout |
| UI state | `useState` | Modals, filters, edit targets |

### Query key conventions

```js
queryKeys.todos.lists()          // All todo list queries
queryKeys.todos.list(params)     // Specific list with params
queryKeys.todos.stats()          // Statistics
queryKeys.categories.list()      // Category list
```

### Optimistic updates

Toggle completion and category deletion use optimistic updates — the UI responds immediately, then rolls back if the server returns an error.

---

## Available Scripts

### Backend

```bash
php artisan serve          # Start dev server
php artisan migrate        # Run migrations
php artisan migrate:fresh  # Reset and re-run all migrations
php artisan tinker         # Interactive REPL
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## License

MIT
