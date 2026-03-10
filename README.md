# PT Gibalfaukinsonliktangpinrappitdrut (Persero) Tbk - Full-Stack Bilingual Corporate Website

Production-ready MVP built with Next.js App Router + Prisma + PostgreSQL.

## Stack
- Next.js 16 (App Router, TypeScript)
- Prisma ORM
- PostgreSQL
- Custom admin CMS
- Server-side role-based access (ADMIN, EDITOR, HR)
- Optional email notifications via Resend

## Features Implemented
- Bilingual public site (`/en`, `/id`)
  - Home, About, Industries, Careers, Career Detail + Apply, News, Contact
- Public API
  - pages, industries, leadership, jobs, job apply, news, contact, CV upload
- Admin CMS
  - auth/login/logout/me
  - pages, industries, leadership, jobs, news CRUD APIs
  - applications list + status update
  - inquiries list
  - audit logs
- Security/operations
  - HTTP security headers
  - route protection middleware for admin pages
  - API validation + rate limiting
  - health check: `/api/health`
  - sitemap + robots

## Environment Variables
Copy `.env.example` to `.env` and update:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gibalfaukinson?schema=public"
AUTH_SECRET="change-this-to-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"

# Optional (email notifications)
RESEND_API_KEY=""
EMAIL_FROM="no-reply@your-domain.com"
HR_NOTIFICATION_EMAIL="hr@your-domain.com"

# Optional
ADMIN_SEED_PASSWORD="Admin@12345"
```

## Local Development
### 1) Install dependencies
```bash
npm install
```

### 2) Start PostgreSQL (recommended with Docker)
```bash
docker compose up -d
```

### 3) Generate Prisma client + create schema + seed data
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4) Run app
```bash
npm run dev
```

Open:
- Public site: `http://localhost:3000/en`
- Admin login: `http://localhost:3000/admin/login`

## Seeded Admin Account
- Email: `admin@pt-gibalfaukinsonliktangpinrappitdrut.com`
- Password: `Admin@12345` (or `ADMIN_SEED_PASSWORD`)

Change this immediately in production.

## Deployment (Vercel)
### 1) Create a managed PostgreSQL database
Use Neon/Supabase/RDS and get connection string.

### 2) Set Vercel Environment Variables
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- optional email vars (`RESEND_API_KEY`, `EMAIL_FROM`, `HR_NOTIFICATION_EMAIL`)

### 3) Build command
Default:
```bash
npm run build
```

`postinstall` runs `prisma generate` automatically.

### 4) Run production migrations/seed
For controlled production rollout, run:
```bash
npm run db:migrate:deploy
```

If this is first deployment and you need baseline data:
```bash
npm run db:seed
```

## QA Checklist Before Go-Live
- Public EN/ID pages load correctly
- Contact form submits and appears in admin inquiries
- Career apply submits and appears in admin applications
- Application status update works (NEW -> REVIEWING/SHORTLISTED/REJECTED)
- Role-based restrictions enforced on admin APIs
- `/api/health` returns `status: ok`
- sitemap and robots available:
  - `/sitemap.xml`
  - `/robots.txt`

## Useful Scripts
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run db:generate`
- `npm run db:push`
- `npm run db:migrate:deploy`
- `npm run db:seed`

