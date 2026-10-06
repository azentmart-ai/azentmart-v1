CREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE IF NOT EXISTS tenants (

    id UUID PRIMARY KEY,

    name TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()

);


CREATE TABLE IF NOT EXISTS users (

    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    email TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()

);


CREATE TABLE IF NOT EXISTS conversations (

    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL REFERENCES tenants(id),

    role TEXT NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()

);


CREATE TABLE IF NOT EXISTS documents (

    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL REFERENCES tenants(id),

    title TEXT NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()

);


CREATE TABLE IF NOT EXISTS document_chunks (

    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL REFERENCES tenants(id),

    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    embedding vector(384),

    created_at TIMESTAMPTZ DEFAULT now()

);


CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx

ON document_chunks USING hnsw (embedding vector_cosine_ops);


CREATE TABLE IF NOT EXISTS campaigns (

    id UUID PRIMARY KEY,

    tenant_id UUID NOT NULL REFERENCES tenants(id),

    name TEXT NOT NULL,

    output JSONB NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()

);