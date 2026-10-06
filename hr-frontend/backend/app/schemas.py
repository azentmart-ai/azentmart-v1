from datetime import date
from pydantic import BaseModel, EmailStr, Field

class SignupIn(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    department: str | None = None
class LoginIn(BaseModel):
    email: EmailStr
    password: str
class UserOut(BaseModel):
    id: int; name: str; email: EmailStr; role: str; department: str | None = None
class EmployeeIn(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    phone: str | None = None
    department: str | None = None
    designation: str | None = None
    location: str | None = None
    manager: str | None = None
    employment_type: str = "Full-time"
    salary: float | None = None
    date_of_birth: date | None = None
    join_date: date | None = None
    bank_name: str | None = None
    bank_account: str | None = None
    ifsc_code: str | None = None
class LeaveIn(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    reason: str | None = None
class TicketIn(BaseModel):
    subject: str = Field(min_length=2, max_length=200)
    category: str = "General HR"
    description: str = Field(min_length=2)
class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
