A complete authentication and user management system built with NestJS on the backend and React + Redux Toolkit + RTK Query on the frontend. It implements a modern token-based flow using JWT access and refresh tokens, including automatic access token renewal.

Key Features:
User registration and login
Route protection via JWT Guards
Tokens stored in Redux state
Automatic access token refresh via RTK Query
Profile page using /auth/me
Protected frontend routes with ProtectedRoute
CORS support for local network development


Technologies:

Backend (NestJS):
Node.js, NestJS, TypeORM, PostgreSQL
JWT-based Auth (access + refresh tokens)
Docker support (optional)

Frontend (React):
React (Vite), Redux Toolkit, RTK Query
React Router, SCSS Modules
Centralized API auth and auto-refresh flow

---

# Backend

NestJS backend for authentication and user management.

## Stack

Node.js
NestJS
PostgreSQL
TypeORM
JWT (access + refresh)
Bcrypt for password hashing

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
JWT_SECRET=your_super_secret_key
PORT=3000
```

> Or set directly in `jwtConstants` (dev only)

### 3. Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 4. Run app

```bash
npm run start:dev
```

---

## Features

- Registration & Login
- Access / Refresh Token Flow
- Refresh rotation + storage in DB
- Protected Routes (JWT Guard)
- Get current user `/auth/me`

---

## Test endpoints

Use Postman or curl:

```bash
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /auth/me
```

---

## Project Structure

```
src/
├── auth/        # Auth module (JWT, login, refresh)
├── user/        # User module (entity, service)
├── main.ts      # App entry point
```

---

## Useful Scripts

```bash
npm run start         # Production
npm run start:dev     # Dev mode
npm run test          # Run tests (Jest)
```

---

## Security Notes

- Store `refreshToken` in HttpOnly cookie (recommended)
- JWT secret must be in `.env` in production

---

# Frontend

React frontend for the auth system. Built with Vite + Redux Toolkit + RTK Query.

---

## Stack

- React (Vite)
- Redux Toolkit + RTK Query
- React Router
- SCSS Modules

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run dev server

```bash
npm run dev
```

Frontend runs at:  
`http://localhost:5173` (or your LAN IP if accessed from another device)

---

## Features

- Login / Register forms
- Access + refresh token flow (automatic)
- Profile page (`/profile`)
- Protected routes (`ProtectedRoute`)
- Redux state for tokens + user
- Auto-refresh access token via RTK Query

---

## Project Structure

```
src/
├── app/            # Redux store
├── features/
│   └── auth/       # authSlice, api, components
├── pages/          # Profile, Home
├── components/     # ProtectedRoute
├── styles/         # global.scss
```

---

## Notes

- Tokens are stored in Redux store
- Refresh token used automatically for 401 via `baseQueryWithReauth`
- You can move refreshToken to HttpOnly cookie for better security

---

## CORS

Make sure backend has:

```ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://<your-ip>:5173'],
  credentials: true,
});
```

And backend must listen on `0.0.0.0`:

```ts
await app.listen(3000, '0.0.0.0');
```
