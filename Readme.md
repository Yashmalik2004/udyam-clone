# Udyam Registration Portal Clone

Recreation of the first two steps of the Government of India Udyam Registration Portal. Features a modular TypeScript clean architecture, dynamic schema-driven form generation via offline web scraping, and a client-side layout styled with TailwindCSS.

## Project Architecture

```
                                  +------------------------------------+
                                  |    Live Udyam Registration Site    |
                                  +------------------------------------+
                                                    |
                                                    |  Scrapes HTML & field validation
                                                    v
                                  +------------------------------------+
                                  |      Puppeteer Web Scraper         |
                                  +------------------------------------+
                                                    |
                                                    |  Writes structure config
                                                    v
                                  +------------------------------------+
                                  |         scraper/output/            |
                                  |           schema.json              |
                                  +------------------------------------+
                                                    |
                                                    |  Serves dynamic UI model
                                                    v
+------------------------+        +------------------------------------+
|  Vite + React Frontend | <====> |    Express Node.js TypeScript API  |
|  (Aadhaar/OTP -> PAN)  |        +------------------------------------+
+------------------------+                          |
                                                    |  Prisma Client ORM
                                                    v
                                  +------------------------------------+
                                  |        Supabase PostgreSQL DB      |
                                  +------------------------------------+
```

See [docs/architecture.md](file:///c:/Users/YASH/Desktop/udyam-clone/docs/architecture.md) for more details.

---

## Folder Structure Explained

```
├── backend/                  # Node.js + Express + Prisma REST API
│   ├── prisma/               # Database schemas & migrations
│   └── src/
│       ├── config/           # Safe Env and DB client singleton
│       ├── controllers/      # Route controllers (Thin controller layer)
│       ├── middlewares/      # 404, error logging, validations
│       ├── routes/           # REST endpoints definition
│       ├── schemas/          # Server Zod validation schemas
│       ├── services/         # Mock OTP & PAN validate services
│       └── utils/            # In-memory OTP cache, standard response
│
├── frontend/                 # Vite + React SPA Client
│   ├── src/
│   │   ├── components/       # UI buttons, Dynamic fields, dynamic forms
│   │   ├── layouts/          # Government theme portal frame
│   │   ├── pages/            # StepOne, StepTwo, Success, Home views
│   │   ├── services/         # Axios API connection endpoints
│   │   └── utils/            # Client Zod form validation rules
│
└── scraper/                  # Puppeteer headless metadata extraction tool
    ├── src/
    │   ├── extractors/       # Page evaluate field & label parser
    │   └── utils/            # Fallback JSON structure builders
    └── output/               # Target schema.json location
```

---

## Environment Variables Configuration

Copy `backend/.env.example` to `backend/.env` and update the connection settings.

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connections (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Authentication / Verification Tokens
JWT_SECRET="your_super_secret_jwt_key_here_change_in_production"
OTP_EXPIRY_MINUTES=5

# Winston Logs Configuration
LOG_LEVEL="info"

# Frontend URL (CORS verification)
FRONTEND_URL="http://localhost:5173"
```

Also generate a root-level `.env` file containing these placeholders for easy local development reference.

---

## Setup & Running Guide

### 1. Database (Prisma + Supabase)

Ensure you have created a Supabase project and fetched the connection pooling string.

```bash
# Move to backend workspace
cd backend

# Generate Prisma client assets
npm run prisma:generate

# Generate initial migration and push model to Supabase PostgreSQL database
npm run prisma:migrate --name init
```

### 2. Run the Scraper (Optional)

The schema.json has been pre-populated with standard default structures. If you wish to run the live scraper:

```bash
# Move to scraper workspace
cd scraper

# Run Puppeteer scraper script
npm run scrape
```

### 3. Run Backend API Server

```bash
# Move to backend workspace
cd backend

# Start local server with hot reloading
npm run dev
```

### 4. Run Frontend React SPA Client

```bash
# Move to frontend workspace
cd frontend

# Start local dev server
npm run dev
```

The frontend application should now be accessible at [http://localhost:5173](http://localhost:5173).
Check the backend server console log for the generated mock 6-digit OTP code when verifying Step 1.
