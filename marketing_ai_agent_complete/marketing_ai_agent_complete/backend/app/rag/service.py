from uuid import uuid4

import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.config import settings
from app.db.database import execute, fetchall


_model = None


def model():
    global _model

    if _model is None:
        _model = SentenceTransformer(
            settings.EMBEDDING_MODEL
        )

    return _model


def chunk(text, size=700):
    words = text.split()

    return [
        " ".join(words[i:i + size])
        for i in range(0, len(words), size)
    ] or [text]


def ingest(tenant_id, title, content):
    doc_id = uuid4()

    execute(
        """
        INSERT INTO documents(
            id,
            tenant_id,
            title,
            content
        )
        VALUES (
            :id,
            :tenant,
            :title,
            :content
        )
        """,
        {
            "id": doc_id,
            "tenant": tenant_id,
            "title": title,
            "content": content,
        },
    )

    chunks = chunk(content)

    vectors = model().encode(
        chunks,
        normalize_embeddings=True,
    )

    for c, v in zip(chunks, vectors):

        execute(
            """
            INSERT INTO document_chunks(
                id,
                tenant_id,
                document_id,
                content,
                embedding
            )
            VALUES (
                :id,
                :tenant,
                :doc,
                :content,
                :embedding
            )
            """,
            {
                "id": uuid4(),
                "tenant": tenant_id,
                "doc": doc_id,
                "content": c,
                "embedding": v.tolist(),
            },
        )

    return str(doc_id), len(chunks)


def retrieve(tenant_id, query, k=5):

    v = model().encode(
        [query],
        normalize_embeddings=True,
    )[0].tolist()

    rows = fetchall(
        """
        SELECT
            content,
            1 - (
                embedding <=> CAST(
                    :embedding AS vector
                )
            ) AS score
        FROM document_chunks
        WHERE tenant_id = :tenant
        ORDER BY embedding <=> CAST(
            :embedding AS vector
        )
        LIMIT :k
        """,
        {
            "tenant": tenant_id,
            "embedding": str(v),
            "k": k,
        },
    )

    return list(rows)