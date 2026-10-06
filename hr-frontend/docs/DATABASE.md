# Database

Database:

```text
azentmart_hr
```

Core tables:

- users
- employees
- onboarding
- attendance
- leave_requests
- documents
- policies
- benefits
- payroll
- tickets

The local development application creates tables automatically on startup.

For production, replace automatic table creation with a proper
migration system such as Alembic.
