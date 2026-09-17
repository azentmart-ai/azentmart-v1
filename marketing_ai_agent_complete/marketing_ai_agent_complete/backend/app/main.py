from uuid import uuid4

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator

from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_tenant_id_from_token,
)

from app.db.database import execute, fetchall
from app.rag.service import ingest, retrieve
from app.agents.orchestrator import MarketingOrchestrator
from app.mcp.client import list_tools, call_tool


app = FastAPI(
    title="Marketing AI Agent Platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# JWT AUTHENTICATION
# ============================================================

bearer_scheme = HTTPBearer()


def get_current_tenant(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
):
    """
    Extract and validate JWT from:

    Authorization: Bearer <token>

    Then return the tenant_id stored inside the JWT.
    """

    token = credentials.credentials

    try:
        tenant_id = get_tenant_id_from_token(token)

        if not tenant_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )

        return tenant_id

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
        )


# ============================================================
# REQUEST MODELS
# ============================================================


class TenantIn(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Tenant name is required.")

        return value


class DocumentIn(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
    )

    content: str = Field(
        ...,
        min_length=1,
        max_length=100000,
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Document title is required.")

        return value

    @field_validator("content")
    @classmethod
    def validate_content(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Document content is required.")

        return value


class ChatIn(BaseModel):
    task: str = Field(
        ...,
        min_length=1,
        max_length=10000,
    )

    # Optional agent selection.
    #
    # If omitted:
    #   Full multi-agent campaign mode
    #
    # If provided:
    #   Individual agent mode
    #
    agent: str | None = Field(
        default=None,
        max_length=50,
    )

    @field_validator("task")
    @classmethod
    def validate_task(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Marketing task is required.")

        return value

    @field_validator("agent")
    @classmethod
    def validate_agent(cls, value):
        if value is None:
            return None

        value = value.strip().lower()

        if not value:
            return None

        return value


class ToolIn(BaseModel):
    arguments: dict = Field(
        default_factory=dict
    )


class LoginIn(BaseModel):
    email: str = Field(
        ...,
        min_length=3,
        max_length=254,
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
    )

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        value = value.strip().lower()

        if "@" not in value:
            raise ValueError("Invalid email address.")

        return value


class RegisterIn(BaseModel):
    company_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    email: str = Field(
        ...,
        min_length=3,
        max_length=254,
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )

    @field_validator("company_name")
    @classmethod
    def validate_company_name(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Company name is required.")

        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        value = value.strip().lower()

        if "@" not in value:
            raise ValueError("Invalid email address.")

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError(
                "Password must contain at least 8 characters."
            )

        return value


# ============================================================
# HEALTH
# ============================================================


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# ============================================================
# REGISTER
# ============================================================


@app.post("/register")
def register(body: RegisterIn):

    company_name = body.company_name.strip()
    email = body.email.strip().lower()
    password = body.password

    # --------------------------------------------------------
    # Check whether email already exists
    # --------------------------------------------------------

    existing_user = fetchall(
        """
        SELECT id
        FROM users
        WHERE email = :email
        LIMIT 1
        """,
        {
            "email": email
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # --------------------------------------------------------
    # Create new tenant
    # --------------------------------------------------------

    tenant_id = uuid4()

    execute(
        """
        INSERT INTO tenants(
            id,
            name
        )
        VALUES(
            :id,
            :name
        )
        """,
        {
            "id": tenant_id,
            "name": company_name,
        }
    )

    # --------------------------------------------------------
    # Create user inside the new tenant
    # --------------------------------------------------------

    user_id = uuid4()

    password_hash = hash_password(password)

    execute(
        """
        INSERT INTO users(
            id,
            tenant_id,
            email,
            password_hash
        )
        VALUES(
            :id,
            :tenant_id,
            :email,
            :password_hash
        )
        """,
        {
            "id": user_id,
            "tenant_id": tenant_id,
            "email": email,
            "password_hash": password_hash,
        }
    )

    # --------------------------------------------------------
    # Create JWT immediately
    # --------------------------------------------------------

    access_token = create_access_token(
        user_id=str(user_id),
        tenant_id=str(tenant_id),
    )

    return {
        "message": "Account created successfully.",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user_id),
        "tenant_id": str(tenant_id),
        "email": email,
        "company_name": company_name,
    }


# ============================================================
# LOGIN
# ============================================================


@app.post("/login")
def login(body: LoginIn):

    users = fetchall(
        """
        SELECT
            id,
            tenant_id,
            email,
            password_hash
        FROM users
        WHERE email = :email
        LIMIT 1
        """,
        {
            "email": body.email.strip().lower()
        }
    )

    if not users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user = users[0]

    if not verify_password(
        body.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(
        user_id=str(user["id"]),
        tenant_id=str(user["tenant_id"]),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user["id"]),
        "tenant_id": str(user["tenant_id"]),
        "email": user["email"],
    }


# ============================================================
# TENANTS
# ============================================================


@app.post("/tenants")
def create_tenant(
    body: TenantIn,
    tenant=Depends(get_current_tenant),
):
    """
    Create an additional tenant only for an authenticated user.

    Normal account creation should use /register.
    """

    tid = uuid4()

    execute(
        """
        INSERT INTO tenants(
            id,
            name
        )
        VALUES(
            :id,
            :name
        )
        """,
        {
            "id": tid,
            "name": body.name.strip(),
        }
    )

    return {
        "tenant_id": str(tid),
        "name": body.name.strip(),
    }


# ============================================================
# DOCUMENTS / RAG INGESTION
# ============================================================


@app.post("/documents")
def add_document(
    body: DocumentIn,
    tenant=Depends(get_current_tenant),
):

    doc_id, count = ingest(
        tenant,
        body.title,
        body.content,
    )

    return {
        "document_id": doc_id,
        "chunks": count,
    }


# ============================================================
# RAG SEARCH
# ============================================================


@app.get("/rag/search")
def rag_search(
    q: str,
    tenant=Depends(get_current_tenant),
):

    q = q.strip()

    if not q:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query is required.",
        )

    if len(q) > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query is too long.",
        )

    return {
        "results": retrieve(
            tenant,
            q,
        )
    }


# ============================================================
# CHAT / MARKETING AGENT
# ============================================================


@app.post("/chat")
def chat(
    body: ChatIn,
    tenant=Depends(get_current_tenant),
):

    # --------------------------------------------------------
    # Retrieve conversation memory
    # --------------------------------------------------------

    memories = fetchall(
        """
        SELECT
            role,
            content
        FROM conversations
        WHERE tenant_id = :tenant
        ORDER BY created_at DESC
        LIMIT 10
        """,
        {
            "tenant": tenant
        }
    )

    # --------------------------------------------------------
    # Retrieve RAG context
    # --------------------------------------------------------

    context = retrieve(
        tenant,
        body.task,
    )

    context_text = "\n".join(
        r["content"]
        for r in context
    )

    # --------------------------------------------------------
    # Build memory context
    # --------------------------------------------------------

    memory_text = "\n".join(
        f"{r['role']}: {r['content']}"
        for r in memories
    )

    # --------------------------------------------------------
    # Run Marketing Agent Orchestrator
    # --------------------------------------------------------
    #
    # If body.agent is provided:
    #     Run only the selected AI Employee.
    #
    # If body.agent is None:
    #     Run the complete multi-agent workflow.
    #
    # --------------------------------------------------------

    result = MarketingOrchestrator().run(
        body.task,
        context_text,
        memory_text,
        body.agent,
    )

    # --------------------------------------------------------
    # Save user message
    # --------------------------------------------------------

    execute(
        """
        INSERT INTO conversations(
            id,
            tenant_id,
            role,
            content
        )
        VALUES(
            :id,
            :tenant,
            'user',
            :content
        )
        """,
        {
            "id": uuid4(),
            "tenant": tenant,
            "content": body.task,
        }
    )

    # --------------------------------------------------------
    # Save assistant response
    # --------------------------------------------------------

    execute(
        """
        INSERT INTO conversations(
            id,
            tenant_id,
            role,
            content
        )
        VALUES(
            :id,
            :tenant,
            'assistant',
            :content
        )
        """,
        {
            "id": uuid4(),
            "tenant": tenant,
            "content": result.get(
                "final",
                result.get("output", "")
            ),
        }
    )

    return result


# ============================================================
# MCP TOOLS
# ============================================================


@app.get("/mcp/tools")
def mcp_tools(
    tenant=Depends(get_current_tenant),
):

    return {
        "tools": list_tools()
    }


@app.post("/mcp/tools/{name}")
def mcp_tool(
    name: str,
    body: ToolIn,
    tenant=Depends(get_current_tenant),
):

    return call_tool(
        name,
        body.arguments,
    )