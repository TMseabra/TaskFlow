# TaskFlow

Task management platform (mini-Trello/Jira style), built to demonstrate full CRUD, authentication, backend and database integration.

## Stack

- **Frontend/Backend:** Next.js (App Router) + TypeScript
- **API:** Next.js Route Handlers
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** NextAuth.js / Auth.js (email+password and OAuth)

## Features

- Sign up / login
- Create, edit, delete tasks
- Statuses: To Do / In Progress / Done
- Priorities: Low / Medium / High
- Deadlines
- Search
- Filters
- Dashboard with statistics

## Project status

In development - current phase: functional MVP (auth + task CRUD + dashboard).

Implemented:
- Registration and login (email + password, via NextAuth/Auth.js). OAuth (Google/GitHub) is automatically enabled if credentials are set in `.env`.
- Task CRUD (create, edit, delete, change status) via API Route Handlers.
- Search and filters (status, priority) on the task list.
- Dashboard with statistics (total, by status, overdue tasks).
- Protected routes via proxy (`src/proxy.ts`).

To do:
- Automated tests.
- Deployment.
- Screenshots / demo.

See docs/ARCHITECTURE.md for the database schema and folder structure.

## Running locally

Prerequisites: Node.js 20+ and a PostgreSQL database (local, Docker, or a free service like Neon/Supabase).

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env
# edit .env with your DATABASE_URL and generate an AUTH_SECRET with:
npx auth secret

# 3. Create database tables
npx prisma migrate dev --name init

# 4. Start the dev server
npm run dev
```

The app is available at http://localhost:3000. Create an account at `/register` and start using the dashboard and task list at `/dashboard` and `/tasks`.

Other useful commands:
- `npm run build` / `npm run start` - production build and start.
- `npm run lint` - runs ESLint.
- `npm run db:studio` - opens Prisma Studio to inspect the data.

## Development process

Idea -> Planning -> Database/Architecture -> Development -> Git/Branches -> Testing -> Deployment -> README -> Screenshots -> Demo
