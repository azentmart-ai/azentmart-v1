# Marketing AI Agent — Complete 2-Day MVP

This project implements the architecture discussed: **multi-tenant + multi-agent + LLM + RAG + memory + MCP tools + PostgreSQL/pgvector + Docker**.

## Architecture

Frontend → FastAPI → Multi-Agent Orchestrator → Groq LLM

The orchestrator uses Strategy, Content and Email agents. Each tenant gets a UUID and all documents, vectors, conversations and campaigns are scoped with `tenant_id`.

RAG: documents are chunked and embedded with Sentence Transformers, then stored in PostgreSQL pgvector. Retrieval is tenant-filtered.

Memory: recent tenant conversation turns are stored in PostgreSQL and passed back to the orchestrator.

MCP: a separate FastAPI MCP-style tool server exposes campaign_brief and hashtag_suggest tools through a clean tool interface. This is an MVP tool server that can be replaced by a full MCP SDK/server implementation later without changing the agent boundary.

## Run

1. Copy `.env.example` to `.env` and add your `GROQ_API_KEY`.
2. Run `docker compose up --build`.
3. Backend: http://localhost:8000/docs
4. Frontend: run `cd frontend && npm install && npm run dev`.

## Important

The first RAG request downloads/loads the embedding model inside the backend container, so startup or first document ingestion can take longer.

For production, add authentication/JWT, tenant authorization, secrets management, migrations, rate limits, audit logging, object storage for original files, and a standards-compliant MCP transport/server.
