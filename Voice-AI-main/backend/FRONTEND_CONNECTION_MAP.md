# AzentMart Frontend ↔ Backend Connection Map

Base URL:

```text
http://127.0.0.1:8000
```

Protected requests use:

```http
Authorization: Bearer <access_token>
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Store the returned `access_token` in the React app.

## Dashboard

```text
GET /api/dashboard/stats
```

## Assistants

```text
GET    /api/assistants/
POST   /api/assistants/
GET    /api/assistants/{id}
PUT    /api/assistants/{id}
DELETE /api/assistants/{id}
```

The same endpoints support Course Enquiry, Admission Support, Customer Support, Lead Qualification, Billing Support and Technical Support.

## AI Chat

```text
POST /api/chat/message
GET  /api/chat/history/{session_id}
```

## Live Voice

```text
WS /api/voice/live?assistant_id={id}&language={language}&token={jwt}
```

## Contacts

```text
GET    /api/contacts/
POST   /api/contacts/
POST   /api/contacts/import
GET    /api/contacts/{id}
PUT    /api/contacts/{id}
DELETE /api/contacts/{id}
```

## Campaigns

```text
GET    /api/campaigns/
GET    /api/campaigns/{id}
POST   /api/campaigns/
PUT    /api/campaigns/{id}
DELETE /api/campaigns/{id}
```

The campaign request supports both snake_case and common React camelCase names such as `assistantId`, `dialerId`, `contactFilter`, `automationEnabled`, `scheduledEnabled`, `scheduledAt`, `retryEnabled`, `dripEnabled`, `batchQuantity`, `sendOn`, `timezone`, `startTime` and `endTime`.

## Dialers

```text
GET    /api/dialers/
POST   /api/dialers/
PUT    /api/dialers/{id}
DELETE /api/dialers/{id}
```

## Segments

```text
GET    /api/segments/
POST   /api/segments/
PUT    /api/segments/{id}
DELETE /api/segments/{id}
```

## Knowledge Base

```text
GET    /api/knowledge-bases/
POST   /api/knowledge-bases/
GET    /api/knowledge-bases/{id}
PUT    /api/knowledge-bases/{id}
DELETE /api/knowledge-bases/{id}
```

## Call History

```text
GET /api/call-logs/
GET /api/call-logs/{id}
```

## Book a Demo

Public submission:

```text
POST /api/demo-requests/
```

Admin list:

```text
GET /api/demo-requests/
```

The demo request accepts both backend field names and common frontend names such as `fullName`, `workEmail`, `companyName`, `phoneNumber`, `demoFocus`, `whatToAutomate` and `message`.

## Important

The backend does not require separate Python files for each assistant. React can navigate to an assistant detail page using the assistant ID and call the same `/api/assistants/{id}` and `/api/voice/live` endpoints.
