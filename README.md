# Momentscape

A full-stack monorepo built with Next.js 14, Express, and PostgreSQL.

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/daryldiningrat/momentscape.git
   cd momentscape
   ```

2. **Install dependencies and set up Husky**

   ```bash
   npm install
   ```

3. **Create environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Start the development environment**

   ```bash
   docker-compose up
   ```

   Or with a fresh build:

   ```bash
   docker-compose up --build
   ```

## Services

| Service  | URL                     | Port |
| -------- | ----------------------- | ---- |
| Frontend | http://localhost:3000   | 3000 |
| Backend  | http://localhost:5000   | 5000 |
| Database | postgres://localhost:5432 | 5432 |

## Development

- Frontend: Next.js 14 (App Router) in `./frontend`
- Backend: Express API in `./backend`
- Database: PostgreSQL 16 managed with Drizzle ORM in `./packages/database`

## Scripts

```bash
npm run dev                                    # docker-compose up
npm run dev:build                              # docker-compose up --build
npm run down                                   # docker-compose down
npm run lint                                   # lint all workspaces
npm run format                                 # format all files
npm run test                                   # run all tests
npm run db:generate -w @momentscape/database    # generate Drizzle migrations
npm run db:migrate -w @momentscape/database     # apply Drizzle migrations
npm run db:seed -w @momentscape/database        # seed the database
```

## Database

Migrations are handled by Drizzle Kit. `docker-compose up` automatically applies migrations. To manually seed development data:

```bash
npm run db:seed -w @momentscape/database
```

Demo account: `demo@momentscape.test` / `password123`

The ERD is available at `./docs/erd.md`.

## Authentication

NextAuth.js with email/password credentials and JWT session strategy.

- **Sign up:** `/signup`
- **Sign in:** `/login`
- **Protected page:** `/protected-example`
- Middleware redirects unauthenticated users to `/login`.

## Pre-commit Hooks

Husky and lint-staged are configured to run linting and formatting before each commit.

## CI/CD

GitHub Actions runs lint, format checks, and tests on every push. See `.github/workflows/ci.yml`.
