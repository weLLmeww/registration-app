# Registration App

Full-stack two-step registration application.

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS (Vite)
- **Backend:** NestJS + TypeORM + PostgreSQL

## Prerequisites

- Node.js 18+
- PostgreSQL running on localhost:5432

## Setup

### 1. Database

Create a PostgreSQL database:

```sql
CREATE DATABASE registration;
```

### 2. Backend

```bash
cd backend

# Configure database connection (edit if needed)
# Default: localhost:5432, user: postgres, password: postgres, db: registration_app
nano .env

# Install dependencies
npm install

# Start server (port 3001)
npm run start:dev
```

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev
```

## Usage

- Open http://localhost:5173 in your browser
- **Register page** (`/`): Two-step registration form
  - Step 1: Enter email
  - Step 2: Enter name and password
- **Users page** (`/users`): View all registered users

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/users/register` | Register a new user  |
| GET    | `/api/users`          | Get all users        |

## Validation Rules

- **Email:** Required, valid email format
- **Name:** Required
- **Password:** Required, min 6 characters, Latin characters only
