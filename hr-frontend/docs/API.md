# API

Base URL:

```text
http://localhost:8000/api
```

## Authentication

```text
POST /auth/signup
POST /auth/login
GET /auth/me
POST /auth/forgot-password
POST /auth/reset-password
```

## Employees

```text
GET /employees
POST /employees
GET /employees/{employee_id}
```

## HR modules

```text
GET /onboarding
GET /attendance
POST /attendance/regularization
GET /leave
POST /leave
GET /documents
GET /policies
GET /benefits
GET /payroll
GET /support
POST /support
GET /reports/summary
POST /ai-agent/chat
```

All protected endpoints require:

```text
Authorization: Bearer <token>
```
