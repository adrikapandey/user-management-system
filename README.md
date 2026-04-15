# User Management System

A full-stack MERN application for managing users with secure authentication, role-based authorization, audit fields, and separate admin, manager, and user capabilities.

## Features

- JWT-based authentication with access token and refresh token endpoints
- Role-based access control for `admin`, `manager`, and `user`
- Admin user management: create, edit, view, filter, paginate, and deactivate users
- Manager permissions for viewing and updating non-admin users
- User self-service profile management
- Audit metadata: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- React frontend with protected routes and role-aware navigation

## Tech Stack

- Frontend: React, React Router, Axios, Vite
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Authentication: JWT

## Project Structure

```text
.
├── client
│   └── src
└── server
    └── src
```

## Local Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

Copy the example environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env` with your MongoDB connection string and secure JWT secrets.

### 3. Seed the database

```bash
npm --workspace server run seed
```

Seeded accounts:

- `admin@example.com` / `Admin@123`
- `manager@example.com` / `Manager@123`
- `user@example.com` / `User@123`

### 4. Run the backend

```bash
npm run dev:server
```

### 5. Run the frontend

```bash
npm run dev:client
```

## API Overview

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Users

- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users`
- `GET /api/users/:userId`
- `POST /api/users`
- `PATCH /api/users/:userId`
- `DELETE /api/users/:userId`

## Permission Rules

- `admin`
  - Full user management access
- `manager`
  - Can list users
  - Can view and update non-admin users
  - Cannot create or delete users
- `user`
  - Can only view and update their own profile

## Deployment Notes

- Frontend is deployed on Vercel.
- Backend is deployed on Vercel.
- Set `VITE_API_BASE_URL` in the frontend deployment environment to your deployed backend URL plus `/api`.
- Set `CLIENT_URL` in the backend deployment environment to your frontend URL.
