# Recruiting Agent Backend

## PostgreSQL
Create a database named `azentmart_db`, then copy `.env.example` to `.env` and set `DATABASE_URL`.

## Run
python -m venv .venv
.venv\\Scripts\\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Tables are created automatically on startup.

## AI
Set `OPENAI_API_KEY`. The configured default model is `gpt-5.6-luna`. If no API key is configured, AI workflows use conservative local fallbacks so core CRUD and recruiting flows still work.

## Google
Create a Google OAuth web client and set the same client ID in backend `GOOGLE_CLIENT_ID` and frontend `VITE_GOOGLE_CLIENT_ID`. Add `http://localhost:3000` to the authorized JavaScript origins.

## Password reset
For real email delivery set SMTP_* values. Without SMTP, the forgot-password API returns a development reset URL for local testing.
