from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    String,
    Text,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Float,
    JSON,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from ..db import Base


# =========================================================
# TIME
# =========================================================

def utcnow():
    return datetime.now(timezone.utc)


# =========================================================
# USERS
# =========================================================

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
    )

    name: Mapped[str] = mapped_column(
        String(120),
        default="User",
    )

    role: Mapped[str] = mapped_column(
        String(50),
        default="Admin",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    credits: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )

    assistants = relationship(
        "Assistant",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    conversations = relationship(
        "Conversation",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# =========================================================
# LOGIN HISTORY
# =========================================================

class LoginHistory(Base):
    __tablename__ = "login_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        index=True,
    )

    login_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )

    ip_address: Mapped[str] = mapped_column(
        String(100),
        default="",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="SUCCESS",
        index=True,
    )

    user_agent: Mapped[str] = mapped_column(
        Text,
        default="",
    )


# =========================================================
# ASSISTANTS
# =========================================================

class Assistant(Base):
    __tablename__ = "assistants"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        index=True,
    )

    language: Mapped[str] = mapped_column(
        String(80),
        default="Multilingual",
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    company: Mapped[str] = mapped_column(
        String(150),
        default="AzentMart AI",
    )

    assistant_type: Mapped[str] = mapped_column(
        String(30),
        default="INBOUND",
    )

    languages: Mapped[str] = mapped_column(
        String(255),
        default=(
            "English, Tamil, Hindi, Telugu, "
            "Malayalam, Kannada"
        ),
    )

    system_prompt: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    greeting_message: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    voice: Mapped[str] = mapped_column(
        String(100),
        default="",
    )

    language_mode: Mapped[str] = mapped_column(
        String(30),
        default="auto",
    )

    knowledge_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )

    user = relationship(
        "User",
        back_populates="assistants",
    )

    conversations = relationship(
        "Conversation",
        back_populates="assistant",
    )

    call_logs = relationship(
        "CallLog",
        back_populates="assistant",
    )


# =========================================================
# ASSISTANT LANGUAGES
# =========================================================

class AssistantLanguage(Base):
    __tablename__ = "assistant_languages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    assistant_id: Mapped[int] = mapped_column(
        ForeignKey(
            "assistants.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    language: Mapped[str] = mapped_column(
        String(80),
    )


# =========================================================
# ASSISTANT CAPABILITIES
# =========================================================

class AssistantCapability(Base):
    __tablename__ = "assistant_capabilities"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    assistant_id: Mapped[int] = mapped_column(
        ForeignKey(
            "assistants.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    capability: Mapped[str] = mapped_column(
        String(150),
    )


# =========================================================
# CONTACTS
# =========================================================

class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
    )

    segment: Mapped[str] = mapped_column(
        String(150),
        default="",
    )

    email: Mapped[str] = mapped_column(
        String(255),
        default="",
    )

    phone: Mapped[str] = mapped_column(
        String(40),
        index=True,
    )

    extension: Mapped[str] = mapped_column(
        String(20),
        default="-",
    )

    job_title: Mapped[str] = mapped_column(
        String(120),
        default="",
    )

    lifecycle: Mapped[str] = mapped_column(
        String(50),
        default="Lead",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="New",
    )

    language: Mapped[str] = mapped_column(
        String(50),
        default="English",
    )

    source: Mapped[str] = mapped_column(
        String(80),
        default="Manual",
    )

    active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    last_call: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# SEGMENTS
# =========================================================

class Segment(Base):
    __tablename__ = "segments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="ACTIVE",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# DIALERS
# =========================================================

class Dialer(Base):
    __tablename__ = "dialers"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
    )

    type: Mapped[str] = mapped_column(
        String(50),
        default="VOICE",
    )

    phone_number: Mapped[str] = mapped_column(
        String(40),
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Active",
    )

    calls: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# CAMPAIGNS
# =========================================================

class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
    )

    assistant_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("assistants.id"),
        nullable=True,
    )

    dialer_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("dialers.id"),
        nullable=True,
    )

    segment_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("segments.id"),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="ACTIVE",
    )

    call_type: Mapped[str] = mapped_column(
        String(30),
        default="OUTBOUND",
    )

    schedule: Mapped[str] = mapped_column(
        String(120),
        default="Immediate",
    )

    contacts: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    completed: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    contact_filter_json: Mapped[str] = mapped_column(
        Text,
        default="{}",
    )

    automation_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    scheduled_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    scheduled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    retry_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    drip_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    drip_action_name: Mapped[str] = mapped_column(
        String(150),
        default="",
    )

    drip_batch_quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    drip_days_json: Mapped[str] = mapped_column(
        Text,
        default="[]",
    )

    drip_start_date: Mapped[str] = mapped_column(
        String(20),
        default="",
    )

    drip_timezone: Mapped[str] = mapped_column(
        String(80),
        default="Asia/Kolkata",
    )

    drip_start_time: Mapped[str] = mapped_column(
        String(30),
        default="",
    )

    drip_end_time: Mapped[str] = mapped_column(
        String(30),
        default="",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# CAMPAIGN CONTACTS
# =========================================================

class CampaignContact(Base):
    __tablename__ = "campaign_contacts"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    campaign_id: Mapped[int] = mapped_column(
        ForeignKey(
            "campaigns.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    contact_id: Mapped[int] = mapped_column(
        ForeignKey(
            "contacts.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(40),
        default="PENDING",
    )

    attempts: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    last_attempt_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# CONVERSATIONS
# =========================================================

class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    assistant_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "assistants.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    contact_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "contacts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    session_id: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        index=True,
    )

    channel: Mapped[str] = mapped_column(
        String(30),
        default="chat",
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="active",
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        default="New Conversation",
    )

    language: Mapped[str] = mapped_column(
        String(50),
        default="auto",
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    ended_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    duration_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )

    user = relationship(
        "User",
        back_populates="conversations",
    )

    assistant = relationship(
        "Assistant",
        back_populates="conversations",
    )

    messages = relationship(
        "ConversationMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="ConversationMessage.created_at",
    )

    call_log = relationship(
        "CallLog",
        back_populates="conversation",
        uselist=False,
        cascade="all, delete-orphan",
    )


# =========================================================
# CONVERSATION MESSAGES
# =========================================================

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    conversation_id: Mapped[int] = mapped_column(
        ForeignKey(
            "conversations.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    sender_type: Mapped[str] = mapped_column(
        String(30),
    )

    message: Mapped[str] = mapped_column(
        Text,
    )

    message_type: Mapped[str] = mapped_column(
        String(40),
        default="text",
    )

    language: Mapped[str] = mapped_column(
        String(50),
        default="auto",
    )

    input_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    output_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    total_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    latency_ms: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    audio_url: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages",
    )


# =========================================================
# CALL LOGS
# =========================================================

class CallLog(Base):
    __tablename__ = "call_logs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    conversation_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "conversations.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        unique=True,
        index=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    contact_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("contacts.id"),
        nullable=True,
    )

    assistant_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("assistants.id"),
        nullable=True,
    )

    campaign_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("campaigns.id"),
        nullable=True,
    )

    phone: Mapped[str] = mapped_column(
        String(40),
        default="",
    )

    call_type: Mapped[str] = mapped_column(
        String(30),
        default="test",
    )

    duration_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    response_latency_ms: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    cost: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    language: Mapped[str] = mapped_column(
        String(50),
        default="auto",
    )

    sentiment: Mapped[str] = mapped_column(
        String(30),
        default="Neutral",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Completed",
    )

    outcome: Mapped[str] = mapped_column(
        String(120),
        default="",
    )

    transcript: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    recording_url: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    session_id: Mapped[str] = mapped_column(
        String(150),
        default="",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )

    conversation = relationship(
        "Conversation",
        back_populates="call_log",
    )

    assistant = relationship(
        "Assistant",
        back_populates="call_logs",
    )


# =========================================================
# KNOWLEDGE BASE
# =========================================================

class KnowledgeBase(Base):
    __tablename__ = "knowledge_bases"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
    )

    language: Mapped[str] = mapped_column(
        String(50),
        default="English",
    )

    content: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    source_type: Mapped[str] = mapped_column(
        String(30),
        default="FAQ",
    )

    active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# KNOWLEDGE DOCUMENTS
# =========================================================

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    knowledge_base_id: Mapped[int] = mapped_column(
        ForeignKey(
            "knowledge_bases.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    file_name: Mapped[str] = mapped_column(
        String(255),
    )

    file_type: Mapped[str] = mapped_column(
        String(80),
        default="",
    )

    file_url: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    file_size: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="READY",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# KNOWLEDGE CHUNKS
# =========================================================

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    document_id: Mapped[int] = mapped_column(
        ForeignKey(
            "knowledge_documents.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    content: Mapped[str] = mapped_column(
        Text,
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    embedding: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    metadata_json: Mapped[dict] = mapped_column(
        JSON,
        default=dict,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# USAGE RECORDS
# =========================================================

class UsageRecord(Base):
    __tablename__ = "usage_records"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    assistant_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("assistants.id"),
        nullable=True,
        index=True,
    )

    conversation_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "conversations.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    message_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "conversation_messages.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    usage_type: Mapped[str] = mapped_column(
        String(30),
    )

    input_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    output_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    total_tokens: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    duration_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    cost: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )


# =========================================================
# CREDIT TRANSACTIONS
# =========================================================

class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    transaction_type: Mapped[str] = mapped_column(
        String(30),
    )

    amount: Mapped[float] = mapped_column(
        Float,
    )

    balance_after: Mapped[float] = mapped_column(
        Float,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        default="",
    )

    conversation_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "conversations.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )


# =========================================================
# SUBSCRIPTIONS
# =========================================================

class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    plan_name: Mapped[str] = mapped_column(
        String(100),
        default="Free",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="ACTIVE",
    )

    start_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    end_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    minutes_limit: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    tokens_limit: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )


# =========================================================
# PAYMENTS
# =========================================================

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    subscription_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("subscriptions.id"),
        nullable=True,
    )

    amount: Mapped[float] = mapped_column(
        Float,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        default="INR",
    )

    payment_method: Mapped[str] = mapped_column(
        String(50),
        default="",
    )

    transaction_id: Mapped[str] = mapped_column(
        String(150),
        default="",
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="PENDING",
    )

    paid_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# TEAMS
# =========================================================

class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
    )

    description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )


# =========================================================
# TEAM MEMBERS
# =========================================================

class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    team_id: Mapped[int] = mapped_column(
        ForeignKey(
            "teams.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        default="Member",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )


# =========================================================
# SUPPORT TICKETS
# =========================================================

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
    )

    subject: Mapped[str] = mapped_column(
        String(255),
    )

    description: Mapped[str] = mapped_column(
        Text,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="OPEN",
    )

    priority: Mapped[str] = mapped_column(
        String(30),
        default="NORMAL",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
    )

    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )