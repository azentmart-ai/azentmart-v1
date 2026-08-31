# AzentMart AI Voice Agent Backend

FastAPI + PostgreSQL backend for the AzentMart AI Voice frontend.

## Frontend compatibility

This backend is aligned with the current React dashboard structure:

- JWT login / signup / current-user
- Dashboard statistics
- Six multilingual assistants
- Assistant CRUD and assistant-specific live voice sessions
- Course Enquiry, Admission Support, Customer Support, Lead Qualification, Billing Support and Technical Support
- English, Tamil, Hindi, Telugu, Malayalam and Kannada language metadata
- Knowledge base CRUD scoped to the logged-in account
- Contacts CRUD + CSV import
- Dialers CRUD
- Segments CRUD
- Campaign CRUD with the fields used by the campaign builder:
  - assistant
  - dialer
  - contact filter
  - automation
  - scheduled date/time
  - retry
  - drip mode
  - batch quantity
  - send days
  - timezone
  - processing window
- Call history with transcript, duration, cost, sentiment, status and outcome fields
- AI text chat + conversation history
- Book a Demo request submission
- Gemini Live WebSocket voice conversation
- Optional Bolna outbound calling endpoint

## Architecture

```text
React frontend
      |
      | HTTP / JSON + WebSocket
      v
FastAPI
      |
      +---- PostgreSQL
      |
      +---- Gemini Live
      |
      +---- Optional Sarvam
      |
      +---- Optional Bolna
```

## 1. Configure PostgreSQL

Create a database named `azentmart_db` and copy:

```text
backend/.env.example -> backend/.env
```

Set your real values in `.env`:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/azentmart_db
JWT_SECRET_KEY=use-a-long-random-secret
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

Never put these secrets in React or commit `.env` to Git.

## 2. Install

From `backend`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## 3. Existing database migration

If you are upgrading the database used by the previous backend, run:

```powershell
python scripts/migrate_database.py
```

The migration adds the account-ownership columns and campaign-builder fields. For the normal single-user local setup it also attaches legacy unowned records to the first user.

For a completely new database, `seed.py` is enough.

## 4. Seed the application

```powershell
python scripts/seed.py
```

Seeded development account:

```text
Email: admin@azentmart.ai
Password: Admin@123
```

The seed creates/updates six assistants, all with multilingual metadata:

```text
Course Enquiry
Admission Support
Customer Support
Lead Qualification
Billing Support
Technical Support
```

Change the development password before production use.

## 5. Start FastAPI

```powershell
python run.py
```

or:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open:

```text
http://127.0.0.1:8000/docs
```

Health:

```text
http://127.0.0.1:8000/api/health
```

## 6. Frontend API base

The React app should use:

```text
http://127.0.0.1:8000
```

or:

```text
http://localhost:8000
```

and send the JWT on protected requests:

```http
Authorization: Bearer <access_token>
```

For the live voice WebSocket, pass the same token as a query parameter because browsers do not provide a simple custom Authorization header during the WebSocket constructor:

```text
ws://127.0.0.1:8000/api/voice/live?assistant_id=1&language=Tamil&token=<access_token>
```

## Important database behavior

The backend now scopes assistants, contacts, dialers, segments, campaigns, knowledge-base records, conversations and call logs to the authenticated user. This prevents one account from seeing another account's data.

If you already have an old local database, run `migrate_database.py` once before starting the updated backend.

## Live voice

The main live voice route is:

```text
WS /api/voice/live
```

It:

1. Validates the JWT.
2. Finds the requested assistant for the logged-in user.
3. Starts one continuous Gemini Live session.
4. Supports multiple turns.
5. Sends user and assistant transcripts to React.
6. Streams Gemini audio back to React.
7. Saves conversations.
8. Creates a call-log record when the session ends.

The browser should send microphone PCM at 16 kHz and play Gemini output at 24 kHz, as implemented by the existing frontend voice client.

## Text AI chat

```text
POST /api/chat/message
GET  /api/chat/history/{session_id}
```

Example request:

```json
{
  "assistant_id": 1,
  "language": "Tamil",
  "message": "இந்த course பற்றி சொல்லுங்க",
  "session_id": "course-demo-001"
}
```

## Campaigns

The campaign builder can save its complete UI state through:

```text
GET    /api/campaigns/
GET    /api/campaigns/{id}
POST   /api/campaigns/
PUT    /api/campaigns/{id}
DELETE /api/campaigns/{id}
```

Actual outbound dialing is intentionally separate from campaign configuration. The optional Bolna endpoint can be used when a real telephony provider is configured.

## Contacts CSV import

```text
POST /api/contacts/import
```

Accepted basic CSV columns:

```text
name,phone,email,segment,job_title,lifecycle,status,language
```

## Production notes

- Replace the development JWT secret.
- Use a real PostgreSQL password and Gemini/Bolna/Sarvam keys in `.env` only.
- Put FastAPI behind HTTPS/WSS in production.
- Do not expose PostgreSQL directly to the browser.
- Add proper database migrations such as Alembic before production schema changes.
