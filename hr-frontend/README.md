# AzentMart HR People Operations

AzentMart HR is an HR-only People Operations application with a React/Vite frontend, FastAPI backend and PostgreSQL database.

## HR access

The application is restricted to HR roles (`hr_admin`, `hr_manager`, `admin`). The public signup flow creates an HR account. Non-HR accounts cannot enter the protected workspace.

## Included workflows

- HR dashboard with the existing dashboard design preserved; Payroll Snapshot removed.
- Employee directory with manual add, bulk CSV/XLSX import, profile view, edit and delete.
- Automatic onboarding journey when an employee is created.
- Onboarding checklist with persistent task completion and progress.
- Attendance listing and working attendance marking.
- Leave creation for an employee plus approval/rejection.
- HR documents with seeded reference documents, upload, secure view and download.
- Company policies with persistent acknowledgement.
- Benefits reference programs.
- Payroll draft generation, approval and payslip PDF download.
- HR support ticket queue.
- Reports with CSV and Excel export.
- Settings/profile/authentication and logout back to Home.

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Configure PostgreSQL in `backend/.env` before starting the backend.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend uses `VITE_API_URL` when provided; otherwise it uses `/api`.

## Notes

- The ZIP intentionally excludes `.venv`, `node_modules`, `__pycache__`, `.pyc` files and `.env`.
- Uploaded document files are no longer exposed through a public static `/uploads` route. Downloads go through an authenticated API endpoint.
- Database tables are created automatically on startup and the startup migration adds compatible columns for existing PostgreSQL installations.
