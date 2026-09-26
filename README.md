# Recruiting Agent — End-to-End

A React + FastAPI + PostgreSQL recruiting application.

## Stack
- React + Vite
- FastAPI
- PostgreSQL + SQLAlchemy 2
- JWT authentication + PBKDF2 password hashing
- Google account login
- OpenAI Responses API for AI workflows, with conservative local fallbacks when no API key is configured
- Resume parsing for PDF/DOCX/text
- Dynamic jobs, candidates, applications, pipeline, interviews, campaigns, analytics and settings

## 1. PostgreSQL
Install PostgreSQL and create the database:

```sql
CREATE DATABASE azentmart_db;
```

## 2. Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/azentmart_db
JWT_SECRET=use-a-long-random-secret
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
FRONTEND_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
APP_BASE_URL=http://localhost:3000
```

Start:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open API docs at `http://localhost:8000/docs`.

The application creates SQLAlchemy tables automatically at startup.

## 3. Frontend

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

`.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=
```

Open `http://localhost:3000`.

## Authentication
1. Open `/`.
2. Create an account.
3. Signup redirects to `/login`.
4. Login creates a JWT session and redirects to `/dashboard`.
5. The dashboard loads the same user's name from PostgreSQL.
6. Logout clears the session and protected routes return to login.

Google login requires the same Google web client ID in both frontend and backend.

## Password reset
With SMTP configured, reset links are emailed. Without SMTP, local development receives a reset URL from the API so the flow can still be tested.

## AI
Set `OPENAI_API_KEY` for LLM-generated job descriptions, candidate matching, resume extraction, interview questions/evaluation and Candidate Agent responses. If the key is absent or an LLM call fails, core workflows use deterministic fallbacks instead of leaving buttons broken.
