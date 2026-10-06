# AzentMart HR Platform — Enterprise Redesign

## What changed
- Rebuilt the shared React shell around a responsive enterprise navigation, centered global search, user avatar menu, consistent cards/tables/forms/badges/loading/empty/error states.
- Added Tailwind CSS + PostCSS configuration and a reusable visual system.
- Redesigned Home, authentication, Dashboard, Employees, employee profile/form, Onboarding, Attendance, Leave, Documents, Policies, Benefits, Payroll, HR Support, AI HR Support, Reports and Settings.
- Added real backend-backed dashboard metrics, employee filtering/pagination, CSV/XLSX bulk import, scoped employee profiles, attendance marking/filtering, leave approval, document upload, policy search, support administration and global search.
- Removed demo seeding. Only an explicitly configured bootstrap HR administrator is created through environment variables.
- Added role-aware access checks for employee vs HR/admin data access.
- Added an optional PostgreSQL + pgvector knowledge store with OpenAI embeddings and lexical fallback. The AI support endpoint retrieves approved HR knowledge before responding.
- Added authenticated MCP-compatible HR tool endpoints for employee lookup, policy search, employee context and ticket creation.
- Added environment-driven API/proxy configuration; application fetches do not hardcode production hosts.

## Frontend setup
```powershell
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL=/api` for same-origin production or your deployed API base URL. For local Vite development, `VITE_DEV_API_PROXY_TARGET` points the `/api` proxy at the backend.

## Backend setup
Use Python 3.12 for this project.

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Configure `DATABASE_URL`, JWT settings, CORS origins and the bootstrap HR admin in `.env` from `.env.example`.

## RAG / pgvector
Set `ENABLE_PGVECTOR=true` only when the PostgreSQL server has permission to create/use the `vector` extension. Set `OPENAI_API_KEY` to enable semantic embeddings. Without the key or extension, the AI layer falls back to approved database text retrieval rather than fabricating a knowledge answer.

## Bulk employee import
The HR employee screen accepts CSV and XLSX. Required columns are `name` and `email`; optional columns include `phone`, `department`, `designation`/`role`, `location`, `manager`, `employment_type`, `salary`, `join_date` and `status`.

## Production notes
- Use HTTPS and a long random JWT secret.
- Use object storage (S3-compatible) instead of local `UPLOAD_DIR` for production documents.
- Configure transactional email for password reset notifications before enabling self-service password recovery in production.
- Configure PostgreSQL backups, audit retention, secrets management and least-privilege database credentials.
