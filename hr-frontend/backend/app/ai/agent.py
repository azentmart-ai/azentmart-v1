import json
import os
import urllib.error
import urllib.request
from datetime import date, datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models import (
    Benefit,
    Document,
    Policy,
    Employee,
    Leave,
    Attendance,
    Payroll,
    Onboarding,
    OnboardingTask,
    Ticket,
)
from ..knowledge import retrieve
from ..dependencies import is_hr


# ============================================================
# AzentMart AI HR Assistant
# ============================================================
# This file is the backend intelligence/context layer for the
# HR chatbot.
#
# It supports:
#   - Employees
#   - Attendance
#   - Leave
#   - Payroll / salary / payslips
#   - Policies
#   - Documents
#   - Benefits
#   - Onboarding
#   - Onboarding tasks
#   - HR Support / Tickets
#   - HR Reports / dashboard summaries
#   - RAG knowledge
#   - Navigation intents for the React frontend
#   - OpenAI grounded responses
#
# IMPORTANT:
# The assistant only sends authorized database/RAG information
# to the LLM. It does not invent database values.
# ============================================================


# ============================================================
# HELPERS
# ============================================================

def _safe_value(value, default="-"):
    if value is None:
        return default

    if isinstance(value, str):
        value = value.strip()

    return value if value != "" else default


def _money(value):
    try:
        return f"₹{float(value or 0):,.2f}"
    except Exception:
        return "₹0.00"


def _contains(text: str, words):
    text = (text or "").lower()
    return any(word in text for word in words)


def _employee_for_user(db: Session, user):
    if not user:
        return None

    return (
        db.query(Employee)
        .filter(Employee.user_id == user.id)
        .first()
    )


def _authorized_employee_query(db: Session, user):
    query = db.query(Employee)

    if not is_hr(user):
        query = query.filter(Employee.user_id == user.id)

    return query


def _authorized_employee_ids(db: Session, user):
    return [
        row.id
        for row in _authorized_employee_query(db, user).all()
    ]


def _append_source(sources, title, source_type="database"):
    source = {"title": title, "type": source_type}

    if source not in sources:
        sources.append(source)


def _column_exists(model, name):
    return hasattr(model, name)


def _value(obj, *names, default="-"):
    for name in names:
        if hasattr(obj, name):
            value = getattr(obj, name, None)
            if value is not None and value != "":
                return value
    return default


# ============================================================
# EMPLOYEES
# ============================================================

def _get_employee_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "employee",
            "employees",
            "staff",
            "person",
            "people",
            "worker",
            "who",
            "team",
            "employee details",
            "employee information",
            "employee profile",
            "employee profiles",
            "my details",
        ],
    ):
        return

    query = _authorized_employee_query(db, user)

    # If the user asks for a specific employee name/email, try to
    # narrow the result before falling back to the authorized list.
    words = [
        word.strip(" ,.?")
        for word in text.split()
        if len(word.strip(" ,.?")) >= 3
    ]

    if words and _column_exists(Employee, "name"):
        name_filters = []
        for word in words:
            name_filters.append(Employee.name.ilike(f"%{word}%"))

        # Avoid making normal words such as "show" too important.
        useful = [
            w for w in words
            if w not in {
                "show", "give", "tell", "list", "details", "about",
                "employee", "employees", "information", "profile",
                "please", "what", "who", "are", "the", "my",
            }
        ]

        if useful:
            from sqlalchemy import or_

            name_filters = [
                Employee.name.ilike(f"%{w}%")
                for w in useful[:3]
            ]

            if name_filters:
                candidate_query = query.filter(or_(*name_filters))
                candidate_rows = (
                    candidate_query
                    .order_by(Employee.id.desc())
                    .limit(30)
                    .all()
                )

                if candidate_rows:
                    query = candidate_query

    rows = (
        query
        .order_by(Employee.id.desc())
        .limit(30)
        .all()
    )

    if not rows:
        return

    employee_lines = []

    for employee in rows:
        employee_lines.append(
            "ID: "
            + str(_value(employee, "id"))
            + " | Employee ID: "
            + str(_value(employee, "employee_code", "employee_id", "id"))
            + " | Name: "
            + str(_value(employee, "name"))
            + " | Email: "
            + str(_value(employee, "email"))
            + " | Phone: "
            + str(_value(employee, "phone", "phone_number"))
            + " | Department: "
            + str(_value(employee, "department"))
            + " | Designation: "
            + str(_value(employee, "designation", "role"))
            + " | Location: "
            + str(_value(employee, "location"))
            + " | Joining date: "
            + str(_value(employee, "joining_date", "date_joined"))
            + " | Employment: "
            + str(_value(employee, "employment_type"))
            + " | Manager: "
            + str(_value(employee, "manager", "manager_name"))
            + " | Status: "
            + str(_value(employee, "status"))
        )

    parts.append(
        "EMPLOYEE RECORDS:\n" + "\n".join(employee_lines)
    )
    _append_source(sources, "Employee records")


# ============================================================
# ATTENDANCE
# ============================================================

def _get_attendance_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "attendance",
            "present",
            "absent",
            "late",
            "check in",
            "check-in",
            "check out",
            "check-out",
            "working days",
        ],
    ):
        return

    query = db.query(Attendance)

    if not is_hr(user):
        employee = _employee_for_user(db, user)

        if employee:
            query = query.filter(
                Attendance.employee_id == employee.id
            )
        else:
            query = query.filter(Attendance.id == -1)

    rows = (
        query
        .order_by(Attendance.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Employee: {_value(row, 'employee_id')} | "
            f"Date: {_value(row, 'work_date', 'date')} | "
            f"Status: {_value(row, 'status')} | "
            f"Check-in: {_value(row, 'check_in')} | "
            f"Check-out: {_value(row, 'check_out')}"
        )

    parts.append(
        "ATTENDANCE RECORDS:\n" + "\n".join(lines)
    )
    _append_source(sources, "Attendance records")


# ============================================================
# LEAVE
# ============================================================

def _get_leave_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "leave",
            "vacation",
            "holiday",
            "sick leave",
            "casual leave",
            "leave request",
            "leave balance",
            "time off",
        ],
    ):
        return

    query = db.query(Leave)

    if not is_hr(user):
        employee = _employee_for_user(db, user)

        if employee:
            query = query.filter(
                Leave.employee_id == employee.id
            )
        else:
            query = query.filter(Leave.id == -1)

    rows = (
        query
        .order_by(Leave.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Employee: {_value(row, 'employee_id')} | "
            f"Type: {_value(row, 'leave_type', 'type')} | "
            f"Start: {_value(row, 'start_date')} | "
            f"End: {_value(row, 'end_date')} | "
            f"Status: {_value(row, 'status')} | "
            f"Reason: {_value(row, 'reason')}"
        )

    parts.append(
        "LEAVE RECORDS:\n" + "\n".join(lines)
    )
    _append_source(sources, "Leave records")


# ============================================================
# PAYROLL
# ============================================================

def _get_payroll_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "payroll",
            "salary",
            "payslip",
            "pay slip",
            "gross",
            "net pay",
            "net salary",
            "pf",
            "tds",
            "deduction",
            "bank transfer",
            "neft",
        ],
    ):
        return

    query = db.query(Payroll)

    if not is_hr(user):
        employee = _employee_for_user(db, user)

        if employee:
            query = query.filter(
                Payroll.employee_id == employee.id
            )
        else:
            query = query.filter(Payroll.id == -1)

    rows = (
        query
        .order_by(Payroll.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Payroll ID: {_value(row, 'id')} | "
            f"Employee: {_value(row, 'employee_id')} | "
            f"Month: {_value(row, 'month')} | "
            f"Gross: {_money(_value(row, 'gross_pay', default=0))} | "
            f"PF: {_money(_value(row, 'pf', default=0))} | "
            f"TDS: {_money(_value(row, 'tds', default=0))} | "
            f"Claims: {_money(_value(row, 'claims', default=0))} | "
            f"Net: {_money(_value(row, 'net_pay', default=0))} | "
            f"Status: {_value(row, 'status')}"
        )

    parts.append(
        "PAYROLL RECORDS:\n" + "\n".join(lines)
    )
    _append_source(sources, "Payroll records")


# ============================================================
# POLICIES
# ============================================================
# Your actual Policy model has:
#   id, title, description, version,
#   effective_date, updated_at, status
#
# There is NO `content` field in the supplied model, so this
# function intentionally uses `description`.

def _get_policy_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "policy",
            "policies",
            "hr policy",
            "rule",
            "rules",
            "guideline",
            "guidelines",
            "company policy",
            "company rules",
        ],
    ):
        return

    rows = (
        db.query(Policy)
        .order_by(Policy.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Policy ID: {_value(row, 'id')} | "
            f"Title: {_value(row, 'title', default='HR Policy')} | "
            f"Description: {_value(row, 'description', default='No description available')} | "
            f"Version: {_value(row, 'version', default='1.0')} | "
            f"Effective date: {_value(row, 'effective_date')} | "
            f"Status: {_value(row, 'status', default='Active')} | "
            f"Updated: {_value(row, 'updated_at')}"
        )

    parts.append(
        "HR POLICIES:\n" + "\n".join(lines)
    )
    _append_source(sources, "HR policy records")


# ============================================================
# DOCUMENTS
# ============================================================

def _get_document_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "document",
            "documents",
            "certificate",
            "file",
            "files",
            "proof",
            "uploaded document",
        ],
    ):
        return

    query = db.query(Document)

    if not is_hr(user) and _column_exists(Document, "employee_id"):
        employee = _employee_for_user(db, user)

        if employee:
            query = query.filter(
                Document.employee_id == employee.id
            )
        else:
            query = query.filter(Document.id == -1)

    rows = (
        query
        .order_by(Document.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Document ID: {_value(row, 'id')} | "
            f"Employee: {_value(row, 'employee_id')} | "
            f"Name: {_value(row, 'name', 'title', 'filename', default='Document')} | "
            f"Type: {_value(row, 'document_type', 'type')} | "
            f"Status: {_value(row, 'status')} | "
            f"Uploaded: {_value(row, 'created_at', 'uploaded_at')}"
        )

    parts.append(
        "DOCUMENT RECORDS:\n" + "\n".join(lines)
    )
    _append_source(sources, "HR documents")


# ============================================================
# BENEFITS
# ============================================================

def _get_benefit_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "benefit",
            "benefits",
            "insurance",
            "medical",
            "health insurance",
            "reimbursement",
            "allowance",
        ],
    ):
        return

    query = db.query(Benefit)

    # Benefits are commonly company-level records. If this model
    # has employee_id, non-HR users are restricted to their own.
    if not is_hr(user) and _column_exists(Benefit, "employee_id"):
        employee = _employee_for_user(db, user)

        if employee:
            query = query.filter(
                Benefit.employee_id == employee.id
            )
        else:
            query = query.filter(Benefit.id == -1)

    rows = (
        query
        .order_by(Benefit.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Benefit ID: {_value(row, 'id')} | "
            f"Employee: {_value(row, 'employee_id')} | "
            f"Name: {_value(row, 'name', 'title', default='Benefit')} | "
            f"Description: {_value(row, 'description')} | "
            f"Amount: {_money(_value(row, 'amount', default=0))} | "
            f"Status: {_value(row, 'status')}"
        )

    parts.append(
        "EMPLOYEE BENEFITS:\n" + "\n".join(lines)
    )
    _append_source(sources, "Employee benefits")


# ============================================================
# ONBOARDING
# ============================================================

def _get_onboarding_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "onboarding",
            "onboard",
            "new joiner",
            "new joining",
            "joining",
            "onboarding progress",
            "onboarding status",
        ],
    ):
        return

    query = (
        db.query(Onboarding, Employee)
        .join(
            Employee,
            Employee.id == Onboarding.employee_id,
        )
    )

    if not is_hr(user):
        query = query.filter(Employee.user_id == user.id)

    rows = (
        query
        .order_by(Onboarding.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for onboarding, employee in rows:
        lines.append(
            f"Onboarding ID: {_value(onboarding, 'id')} | "
            f"Employee: {_value(employee, 'name')} | "
            f"Employee ID: {_value(employee, 'id')} | "
            f"Department: {_value(employee, 'department')} | "
            f"Joining date: {_value(employee, 'joining_date', 'date_joined')} | "
            f"Progress: {_value(onboarding, 'progress', default=0)}% | "
            f"Status: {_value(onboarding, 'status')} "
        )

    parts.append(
        "ONBOARDING RECORDS:\n" + "\n".join(lines)
    )
    _append_source(sources, "Onboarding records")


# ============================================================
# ONBOARDING TASKS
# ============================================================

def _get_onboarding_task_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "onboarding task",
            "onboarding tasks",
            "task",
            "tasks",
            "pending task",
            "pending tasks",
        ],
    ):
        return

    query = db.query(OnboardingTask)

    if not is_hr(user) and _column_exists(OnboardingTask, "employee_id"):
        employee = _employee_for_user(db, user)

        if employee:
            query = query.filter(
                OnboardingTask.employee_id == employee.id
            )
        else:
            query = query.filter(OnboardingTask.id == -1)

    rows = (
        query
        .order_by(OnboardingTask.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Task ID: {_value(row, 'id')} | "
            f"Employee: {_value(row, 'employee_id')} | "
            f"Task: {_value(row, 'title', 'name', default='Onboarding task')} | "
            f"Status: {_value(row, 'status')} | "
            f"Due: {_value(row, 'due_date')}"
        )

    parts.append(
        "ONBOARDING TASKS:\n" + "\n".join(lines)
    )
    _append_source(sources, "Onboarding tasks")


# ============================================================
# HR SUPPORT / TICKETS
# ============================================================

def _get_ticket_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "ticket",
            "tickets",
            "support ticket",
            "hr support",
            "support request",
            "complaint",
            "help request",
        ],
    ):
        return

    query = db.query(Ticket)

    if not is_hr(user) and _column_exists(Ticket, "user_id"):
        query = query.filter(Ticket.user_id == user.id)

    rows = (
        query
        .order_by(Ticket.id.desc())
        .limit(50)
        .all()
    )

    if not rows:
        return

    lines = []

    for row in rows:
        lines.append(
            f"Ticket #{_value(row, 'id')} | "
            f"Subject: {_value(row, 'subject')} | "
            f"Status: {_value(row, 'status')} | "
            f"Priority: {_value(row, 'priority')} | "
            f"Created: {_value(row, 'created_at')}"
        )

    parts.append(
        "HR SUPPORT TICKETS:\n" + "\n".join(lines)
    )
    _append_source(sources, "HR support tickets")


# ============================================================
# REPORTS / ANALYTICS
# ============================================================
# There is no Report model in the supplied model list.
# Therefore reports are calculated from the existing HR tables.

def _get_report_context(message, db, user, parts, sources):
    text = message.lower()

    if not _contains(
        text,
        [
            "report",
            "reports",
            "analytics",
            "analytics report",
            "summary",
            "overview",
            "dashboard",
            "workforce summary",
            "hr summary",
            "headcount",
            "workforce",
        ],
    ):
        return

    employee_query = _authorized_employee_query(db, user)

    total_employees = employee_query.count()

    active_employees = 0
    if _column_exists(Employee, "status"):
        active_employees = (
            employee_query
            .filter(Employee.status.ilike("active"))
            .count()
        )

    onboarding_query = db.query(Onboarding)

    if not is_hr(user):
        employee_ids = _authorized_employee_ids(db, user)
        if employee_ids:
            onboarding_query = onboarding_query.filter(
                Onboarding.employee_id.in_(employee_ids)
            )
        else:
            onboarding_query = onboarding_query.filter(
                Onboarding.id == -1
            )

    onboarding_count = onboarding_query.count()

    attendance_query = db.query(Attendance)

    if not is_hr(user):
        employee = _employee_for_user(db, user)
        if employee:
            attendance_query = attendance_query.filter(
                Attendance.employee_id == employee.id
            )
        else:
            attendance_query = attendance_query.filter(
                Attendance.id == -1
            )

    attendance_total = attendance_query.count()

    present_count = 0
    absent_count = 0

    if _column_exists(Attendance, "status"):
        present_count = (
            attendance_query
            .filter(
                Attendance.status.ilike("present")
            )
            .count()
        )

        absent_count = (
            attendance_query
            .filter(
                Attendance.status.ilike("absent")
            )
            .count()
        )

    leave_query = db.query(Leave)

    if not is_hr(user):
        employee = _employee_for_user(db, user)
        if employee:
            leave_query = leave_query.filter(
                Leave.employee_id == employee.id
            )
        else:
            leave_query = leave_query.filter(
                Leave.id == -1
            )

    leave_count = leave_query.count()

    ticket_query = db.query(Ticket)

    if not is_hr(user) and _column_exists(Ticket, "user_id"):
        ticket_query = ticket_query.filter(
            Ticket.user_id == user.id
        )

    ticket_count = ticket_query.count()

    payroll_query = db.query(Payroll)

    if not is_hr(user):
        employee = _employee_for_user(db, user)
        if employee:
            payroll_query = payroll_query.filter(
                Payroll.employee_id == employee.id
            )
        else:
            payroll_query = payroll_query.filter(
                Payroll.id == -1
            )

    payroll_count = payroll_query.count()

    gross_total = 0
    net_total = 0
    tds_total = 0

    for row in payroll_query.limit(500).all():
        try:
            gross_total += float(getattr(row, "gross_pay", 0) or 0)
        except Exception:
            pass

        try:
            net_total += float(getattr(row, "net_pay", 0) or 0)
        except Exception:
            pass

        try:
            tds_total += float(getattr(row, "tds", 0) or 0)
        except Exception:
            pass

    report = (
        "HR REPORT SUMMARY:\n"
        f"Total employees: {total_employees}\n"
        f"Active employees: {active_employees}\n"
        f"Onboarding records: {onboarding_count}\n"
        f"Attendance records: {attendance_total}\n"
        f"Present attendance records: {present_count}\n"
        f"Absent attendance records: {absent_count}\n"
        f"Leave records: {leave_count}\n"
        f"HR support tickets: {ticket_count}\n"
        f"Payroll records: {payroll_count}\n"
        f"Payroll gross total: {_money(gross_total)}\n"
        f"Payroll net total: {_money(net_total)}\n"
        f"Payroll TDS total: {_money(tds_total)}"
    )

    parts.append(report)
    _append_source(sources, "HR analytics calculated from database")


# ============================================================
# RAG / KNOWLEDGE BASE
# ============================================================

def _get_rag_context(message, db, parts, sources):
    try:
        results = retrieve(db, message, 5)

        for row in results:
            title = _safe_value(
                getattr(row, "title", None),
                "Approved HR knowledge",
            )

            content = _safe_value(
                getattr(row, "content", None),
                "",
            )

            if content:
                parts.append(
                    "APPROVED KNOWLEDGE:\n"
                    f"{title}\n"
                    f"{content}"
                )

                _append_source(
                    sources,
                    title,
                    "rag",
                )

    except Exception as error:
        print("RAG retrieval error:", repr(error))


# ============================================================
# NAVIGATION + UI ACTION INTENTS
# ============================================================

def _navigation_intent(message):
    text = (message or "").lower().strip()

    navigation = {
        "dashboard": [
            "open dashboard",
            "go to dashboard",
            "show dashboard",
            "open home",
            "go home",
        ],
        "employees": [
            "open employees",
            "go to employees",
            "show employees",
            "employee page",
            "employee list",
        ],
        "attendance": [
            "open attendance",
            "go to attendance",
            "show attendance",
        ],
        "leave": [
            "open leave",
            "go to leave",
            "show leave",
            "leave page",
        ],
        "payroll": [
            "open payroll",
            "go to payroll",
            "show payroll",
            "payroll page",
        ],
        "onboarding": [
            "open onboarding",
            "go to onboarding",
            "show onboarding",
            "onboarding page",
        ],
        "documents": [
            "open documents",
            "go to documents",
            "show documents",
            "documents page",
        ],
        "policies": [
            "open policies",
            "go to policies",
            "show policies",
            "policy page",
        ],
        "benefits": [
            "open benefits",
            "go to benefits",
            "show benefits",
            "benefits page",
        ],
        "support": [
            "open support",
            "go to support",
            "open hr support",
            "show support",
            "support page",
        ],
        "reports": [
            "open reports",
            "go to reports",
            "show reports",
            "analytics page",
            "open analytics",
        ],
        "settings": [
            "open settings",
            "go to settings",
            "show settings",
        ],
    }

    for route, phrases in navigation.items():
        if any(phrase in text for phrase in phrases):
            return route

    return None


def _action_intent(message):
    text = (message or "").lower().strip()

    if _contains(
        text,
        [
            "download payslip",
            "download pay slip",
            "get payslip",
            "get pay slip",
        ],
    ):
        return {
            "type": "download_payslip",
            "route": "/payroll",
            "label": "Download payslip",
        }

    if _contains(
        text,
        [
            "download bank file",
            "download neft",
            "neft file",
            "bank neft",
        ],
    ):
        return {
            "type": "download_bank_file",
            "route": "/payroll",
            "label": "Download bank NEFT file",
        }

    if _contains(
        text,
        [
            "download payslips",
            "download all payslips",
            "payslips zip",
        ],
    ):
        return {
            "type": "download_payslips_zip",
            "route": "/payroll",
            "label": "Download payslips ZIP",
        }

    if _contains(
        text,
        [
            "create ticket",
            "raise ticket",
            "raise hr ticket",
            "contact hr",
        ],
    ):
        return {
            "type": "create_ticket",
            "route": "/support",
            "label": "Create HR support ticket",
        }

    if _contains(
        text,
        [
            "add employee",
            "create employee",
            "new employee",
        ],
    ):
        return {
            "type": "add_employee",
            "route": "/employees/new",
            "label": "Add employee",
        }

    if _contains(
        text,
        [
            "start onboarding",
            "create onboarding",
            "onboard employee",
        ],
    ):
        return {
            "type": "start_onboarding",
            "route": "/onboarding/new",
            "label": "Start onboarding",
        }

    return None


# ============================================================
# CONTEXT BUILDER
# ============================================================

def _grounded_context(message: str, db: Session, user):
    parts = []
    sources = []

    # Every supported HR area is checked independently.
    _get_employee_context(message, db, user, parts, sources)
    _get_attendance_context(message, db, user, parts, sources)
    _get_leave_context(message, db, user, parts, sources)
    _get_payroll_context(message, db, user, parts, sources)
    _get_policy_context(message, db, user, parts, sources)
    _get_document_context(message, db, user, parts, sources)
    _get_benefit_context(message, db, user, parts, sources)
    _get_onboarding_context(message, db, user, parts, sources)
    _get_onboarding_task_context(message, db, user, parts, sources)
    _get_ticket_context(message, db, user, parts, sources)
    _get_report_context(message, db, user, parts, sources)
    _get_rag_context(message, db, parts, sources)

    context = "\n\n".join(parts)

    return context[:30000], sources


# ============================================================
# OPENAI
# ============================================================

def _openai(message: str, context: str):
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print(
            "AzentMart AI: OPENAI_API_KEY is not configured."
        )
        return None

    model = os.getenv(
        "OPENAI_MODEL",
        "gpt-4o-mini",
    )

    system_prompt = """
You are AzentMart AI HR Assistant.

You are an enterprise HR assistant connected to an authorized
AzentMart HR database and approved HR knowledge base.

You can help users with:

- Employee details and profiles
- Attendance
- Leave and leave requests
- Payroll
- Salary
- Payslips
- PF and TDS
- Payroll summaries
- Policies
- Documents
- Benefits
- Onboarding
- Onboarding tasks
- HR support tickets
- HR reports
- HR analytics
- Navigation to HR modules

SECURITY RULES:

1. Use ONLY the supplied authorized database/RAG context.
2. Never invent employee information.
3. Never invent salary information.
4. Never invent attendance information.
5. Never invent leave information.
6. Never invent policy rules.
7. Never reveal another employee's private information to a
   non-HR user.
8. If information is unavailable, clearly say it is unavailable.
9. Never claim that a database action was completed unless the
   backend actually completed it.
10. Never fabricate database records.
11. Do not expose secrets, passwords, API keys or tokens.
12. Treat database records as authoritative over general knowledge.
13. If a user asks for something outside the supplied HR context,
    explain which HR workflow should be used.
14. Do not infer missing values.
15. For financial values, preserve the values supplied by the
    database and format them as Indian Rupees.

RESPONSE STYLE:

- Be concise but useful.
- Use headings when useful.
- Use bullet points for multiple records.
- Answer the user's actual question first.
- For employee details, show the relevant fields only.
- For payroll, clearly distinguish gross, deductions and net pay.
- For onboarding, show employee, progress and status.
- For reports, explain the calculated figures.
- If the user asks "show me", provide the available records.
- If the user asks "open", the application may use the navigation
  instruction returned separately.
"""

    user_prompt = (
        "AUTHORIZED AZENTMART HR CONTEXT:\n\n"
        + (
            context
            if context
            else "No matching authorized database or approved RAG records were found."
        )
        + "\n\nUSER REQUEST:\n"
        + message
    )

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        "temperature": 0.1,
    }

    body = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=60,
        ) as response:
            data = json.loads(
                response.read().decode("utf-8")
            )

            choices = data.get("choices") or []

            if not choices:
                print("OpenAI response contained no choices.")
                return None

            message_data = choices[0].get("message") or {}
            answer = message_data.get("content")

            if not answer:
                print("OpenAI response contained no message content.")
                return None

            return answer.strip()

    except urllib.error.HTTPError as error:
        try:
            error_body = error.read().decode("utf-8")
            print(
                "OpenAI HTTP error:",
                error.code,
                error_body,
            )
        except Exception:
            print(
                "OpenAI HTTP error:",
                error.code,
            )

        return None

    except Exception as error:
        print(
            "OpenAI error:",
            repr(error),
        )
        return None


# ============================================================
# MAIN ANSWER
# ============================================================

def answer(
    message: str,
    db: Session,
    user,
):
    message = (message or "").strip()

    if not message:
        return {
            "answer": "Please enter an HR question.",
            "sources": [],
            "grounded": True,
            "agent": "AzentMart AI HR Assistant",
        }

    navigation = _navigation_intent(message)
    action = _action_intent(message)

    context, sources = _grounded_context(
        message,
        db,
        user,
    )

    ai_response = _openai(
        message,
        context,
    )

    if ai_response:
        response = {
            "answer": ai_response,
            "sources": sources,
            "grounded": True,
            "ai_available": True,
            "agent": "AzentMart AI HR Assistant",
        }

        if navigation:
            response["navigation"] = navigation

        if action:
            response["action"] = action

        return response

    # --------------------------------------------------------
    # Safe fallback when OpenAI is not configured or unavailable.
    # The user still gets actual database/RAG information.
    # --------------------------------------------------------
    if context:
        response = {
            "answer": (
                "I found the following authorized HR information:\n\n"
                + context[:8000]
            ),
            "sources": sources,
            "grounded": True,
            "ai_available": False,
            "agent": "AzentMart AI HR Assistant",
        }

        if navigation:
            response["navigation"] = navigation

        if action:
            response["action"] = action

        return response

    response = {
        "answer": (
            "I couldn't find an authorized HR record or approved "
            "HR knowledge that answers this request. "
            "Please use the relevant HR workflow or raise an "
            "HR support ticket."
        ),
        "sources": [],
        "grounded": True,
        "ai_available": False,
        "agent": "AzentMart AI HR Assistant",
    }

    if navigation:
        response["navigation"] = navigation

    if action:
        response["action"] = action

    return response
