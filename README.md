# Junior Secondary School Result Management Portal

A full-stack result management portal for Junior Secondary School administrators and parents.

## Features

- Admin and parent JWT authentication.
- Student, class, subject, session, and term management.
- Passport upload with JPG, JPEG, and PNG validation.
- Result entry for thirteen subjects with automatic total, grade, and remark calculation.
- Parent dashboard for profile, result viewing, password change, and printing.
- MySQL schema with relationships and seed data.
- Responsive React UI with protected routes.

## Quick Start

1. Create a MySQL database and import `database/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and update the database credentials.
3. Install dependencies:

```bash
npm run install:all
```

4. Start both apps:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Default Admin

Run the backend seed script after configuring `.env`:

```bash
npm run seed --workspace backend
```

- Username: `admin`
- Password: `admin`

Parent login uses the student's admission number as the ID and `0823` as the default password.

## Project Structure

```text
backend/     Express API, MySQL repositories, authentication, uploads
frontend/    React app, pages, routes, context, services, responsive UI
database/    MySQL schema and relationships
docs/        API endpoint documentation
```
