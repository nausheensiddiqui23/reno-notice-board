# Reno Platforms Notice Board

A full-stack notice board application built for the Reno Platforms assignment. The app allows users to create, view, edit, and delete notices, with support for categories, priority levels, publish dates, validation, and urgent notice highlighting.

## Project Overview

Reno Platforms Notice Board is a Next.js Pages Router application backed by PostgreSQL through Prisma. Notices are displayed on the homepage, urgent notices are prioritized visually and in sorting, and users can manage notices through clean add and edit pages.

Core features:

- View all notices on the homepage
- Create notices with server-side validation
- Edit existing notices with pre-filled form data
- Delete notices after confirmation
- Sort urgent notices first
- Sort newest notices first within each priority group
- Show an empty state when no notices exist

## Tech Stack

- Next.js Pages Router
- React
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Supabase
- ESLint

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root.

3. Add the required database environment variables listed below.

4. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open the app:

   ```text
   http://localhost:3000
   ```

## Environment Variables

Create a `.env` file in the project root with:

```env
DATABASE_URL="your-supabase-pooled-postgresql-url"
DIRECT_URL="your-supabase-direct-postgresql-url"
```

Variable purpose:

- `DATABASE_URL`: Used by the application at runtime for Prisma database queries.
- `DIRECT_URL`: Used by Prisma for migrations and direct database operations.

For Supabase, use the connection strings from the project database settings. Keep these values private and do not commit `.env` to version control.

## Database Setup

The database is managed with Prisma and PostgreSQL.

The main model is `Notice`:

- `id`
- `title`
- `body`
- `category`: `Exam`, `Event`, or `General`
- `priority`: `Normal` or `Urgent`
- `publishDate`
- `createdAt`
- `updatedAt`

Run migrations against the configured database:

```bash
npx prisma migrate dev
```

Generate the Prisma client after schema changes:

```bash
npx prisma generate
```

Optional: inspect database records with Prisma Studio:

```bash
npx prisma studio
```

## API Routes

### `GET /api/notices`

Returns all notices. Urgent notices are returned first, followed by newer notices.

### `POST /api/notices`

Creates a new notice.

Required JSON body:

```json
{
  "title": "Mid Semester Exam",
  "body": "Exam starts Monday at 10 AM",
  "category": "Exam",
  "priority": "Urgent",
  "publishDate": "2026-06-11"
}
```

Validation:

- `title` is required
- `body` is required
- `category` must be `Exam`, `Event`, or `General`
- `priority` must be `Normal` or `Urgent`
- `publishDate` must be valid

### `GET /api/notices/[id]`

Returns a single notice by id.

### `PUT /api/notices/[id]`

Updates an existing notice by id. Uses the same validation rules as notice creation.

### `DELETE /api/notices/[id]`

Deletes a notice by id.

## Deployment Steps

1. Push the project to a Git repository.

2. Create a production PostgreSQL database, such as Supabase.

3. Add these environment variables to the deployment platform:

   ```env
   DATABASE_URL="your-production-database-url"
   DIRECT_URL="your-production-direct-database-url"
   ```

4. Run Prisma migrations for production:

   ```bash
   npx prisma migrate deploy
   ```

5. Build the application:

   ```bash
   npm run build
   ```

6. Start the production server:

   ```bash
   npm run start
   ```

For Vercel deployment, add the environment variables in the Vercel project settings, then deploy from the connected Git repository. Ensure migrations have been applied to the production database before using the deployed app.
