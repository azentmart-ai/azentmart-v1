from datetime import datetime
from typing import Any, Optional

from pydantic import AliasChoices, BaseModel, EmailStr, Field, ConfigDict


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = "User"
    role: str = "Admin"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    role: str


class AssistantIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str
    language: str = "Multilingual"
    description: str = ""
    company: str = "AzentMart AI"
    assistant_type: str = Field("INBOUND", validation_alias=AliasChoices("assistant_type", "assistantType", "direction"))
    languages: str | list[str] = "English, Tamil, Hindi, Telugu, Malayalam, Kannada"
    system_prompt: str = Field("", validation_alias=AliasChoices("system_prompt", "systemPrompt", "prompt"))
    knowledge_enabled: bool = Field(True, validation_alias=AliasChoices("knowledge_enabled", "knowledgeEnabled"))
    active: bool = True


class ContactIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str
    segment: str = ""
    email: str = ""
    phone: str
    extension: str = "-"
    job_title: str = Field("", validation_alias=AliasChoices("job_title", "jobTitle"))
    lifecycle: str = "Lead"
    status: str = "New"
    language: str = "English"
    source: str = "Manual"
    active: bool = True


class SegmentIn(BaseModel):
    name: str
    description: str = ""
    status: str = "ACTIVE"


class DialerIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str
    type: str = "VOICE"
    phone_number: str = Field(validation_alias=AliasChoices("phone_number", "phoneNumber"))
    status: str = "Active"
    calls: int = 0
    description: str = ""


class CampaignIn(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str
    assistant_id: Optional[int] = Field(None, validation_alias=AliasChoices("assistant_id", "assistantId"))
    dialer_id: Optional[int] = Field(None, validation_alias=AliasChoices("dialer_id", "dialerId"))
    segment_id: Optional[int] = Field(None, validation_alias=AliasChoices("segment_id", "segmentId"))
    status: str = "ACTIVE"
    call_type: str = Field("OUTBOUND", validation_alias=AliasChoices("call_type", "callType"))
    schedule: str = "Immediate"
    contacts: int = 0
    completed: int = 0
    contact_filter: dict[str, Any] = Field(default_factory=dict, validation_alias=AliasChoices("contact_filter", "contactFilter"))
    automation_enabled: bool = Field(False, validation_alias=AliasChoices("automation_enabled", "automationEnabled"))
    scheduled_enabled: bool = Field(False, validation_alias=AliasChoices("scheduled_enabled", "scheduledEnabled"))
    scheduled_at: Optional[datetime] = Field(None, validation_alias=AliasChoices("scheduled_at", "scheduledAt"))
    retry_enabled: bool = Field(False, validation_alias=AliasChoices("retry_enabled", "retryEnabled"))
    drip_enabled: bool = Field(False, validation_alias=AliasChoices("drip_enabled", "dripEnabled"))
    drip_action_name: str = Field("", validation_alias=AliasChoices("drip_action_name", "actionsName", "actionName"))
    drip_batch_quantity: int = Field(0, validation_alias=AliasChoices("drip_batch_quantity", "batchQuantity"))
    drip_days: list[str] = Field(default_factory=list, validation_alias=AliasChoices("drip_days", "sendOn"))
    drip_start_date: str = Field("", validation_alias=AliasChoices("drip_start_date", "startDate"))
    drip_timezone: str = Field("Asia/Kolkata", validation_alias=AliasChoices("drip_timezone", "timezone"))
    drip_start_time: str = Field("", validation_alias=AliasChoices("drip_start_time", "startTime"))
    drip_end_time: str = Field("", validation_alias=AliasChoices("drip_end_time", "endTime"))


class KnowledgeBaseIn(BaseModel):
    title: str
    language: str = "English"
    content: str = ""
    source_type: str = "FAQ"
    active: bool = True


class ChatIn(BaseModel):
    assistant_id: int
    language: str = "English"
    message: str
    session_id: str = "default"


class N8NVoiceIn(BaseModel):
    assistant_id: int
    language: str = "English"
    transcript: str
    session_id: str = "n8n-session"
    phone_number: str = ""
