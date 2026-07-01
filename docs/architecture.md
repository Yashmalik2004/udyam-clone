# Udyam Registration Portal Clone — System Architecture

The project consists of three main modules:
1. **Frontend**: A React SPA built with Vite, TypeScript, TailwindCSS v4, React Hook Form, and Zod.
2. **Backend**: An Express API built with Node.js, TypeScript, Winston, Morgan, Prisma ORM, and Supabase PostgreSQL.
3. **Scraper**: A standalone Puppeteer scraper that extracts UI field metadata from the live government portal to build a dynamic form rendering schema.

## Component Interactions

```mermaid
graph TD
    subgraph Browser (Client)
        A[React SPA] -->|1. GET /api/schema| B[Dynamic Form Engine]
        B -->|2. Renders dynamic components| C[Form UI]
        C -->|3. POST /api/aadhaar/generate-otp| D[Aadhaar validation]
        C -->|4. POST /api/aadhaar/verify-otp| E[OTP validation]
        C -->|5. POST /api/pan/validate| F[PAN verification]
        C -->|6. POST /api/submit| G[Final submission]
    end

    subgraph Express Backend
        H[Express Server] -->|Serves /schema| I[schema.json]
        H -->|Handles OTP| J[In-Memory OTP Store]
        H -->|Handles Validation| K[Zod Validator Middlewares]
        H -->|Handles Persistence| L[Prisma Client]
    end

    subgraph Database
        L -->|Reads/Writes| M[(Supabase PostgreSQL)]
    end

    subgraph Scraper (Offline Job)
        N[Puppeteer Scraper] -->|Scrapes inputs & metadata| O[Udyam Registration Portal]
        N -->|Saves parsed schema| I
    end

    A -->|Calls APIs| H
```

## Folder Layout & Roles

### `backend/`
- `src/server.ts` & `src/app.ts`: HTTP setup and middleware pipeline.
- `src/config/`: Loaded environment validation & DB connection.
- `src/routes/`: Route declarations.
- `src/controllers/`: Express handlers wrapping responses.
- `src/services/`: Core logic (Aadhaar mock verification, PAN validation checks).
- `src/schemas/`: Server-side Zod validation structures.
- `src/utils/`: In-memory OTP cache storage, response wrappers.
- `src/logger/`: Winston logger setup (combined/error logs).
- `prisma/`: Prisma schema and migration configurations.

### `frontend/`
- `src/routes/`: Client-side route declarations.
- `src/layouts/`: Global wrapper layout (Indian Gov Top banner & layout).
- `src/components/ui/`: Reusable, low-level layout components (Buttons, Inputs, Spinners).
- `src/components/form/`: Dynamic field elements and dynamic form builder.
- `src/pages/`: StepOne, StepTwo, Success, and landing views.
- `src/hooks/`: Schema queries state caching.
- `src/services/`: Axios wrappers for backend calls.

### `scraper/`
- `src/scraper.ts`: Launches Chrome browser and starts Puppeteer.
- `src/parser.ts`: Formats Puppeteer DOM outputs.
- `src/extractors/`: Specific JS scripts to parse input attributes and label matching.
- `output/`: Holds the resulting extracted `schema.json`.
