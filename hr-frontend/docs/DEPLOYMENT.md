# Deployment

## Frontend

Build:

```powershell
npm run build
```

The generated output is:

```text
frontend/dist/
```

The frontend can be hosted on a static hosting service.

Set:

```env
VITE_API_URL=https://api.azentmart.ai/api
```

## Backend

Start FastAPI behind a production process manager:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Set:

```env
FRONTEND_ORIGIN=https://hr.azentmart.ai
```

Set a strong random:

```env
JWT_SECRET_KEY=...
```

Use managed PostgreSQL in production.

## Domains

Suggested setup:

```text
www.azentmart.ai       existing company website
hr.azentmart.ai        HR frontend
api.azentmart.ai       FastAPI API
```

Do not put production secrets into the frontend.
