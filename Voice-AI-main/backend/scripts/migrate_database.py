"""Small development migration helper for the current AzentMart schema.

Run this once when upgrading an existing PostgreSQL database from the older
backend. New installations can simply run seed.py because create_all creates
all columns automatically.
"""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import inspect, text
from app.db import engine, SessionLocal
from app.models.models import User


COLUMNS = {
    "assistants": {
        "user_id": "INTEGER",
    },
    "contacts": {
        "user_id": "INTEGER",
    },
    "segments": {
        "user_id": "INTEGER",
    },
    "dialers": {
        "user_id": "INTEGER",
    },
    "campaigns": {
        "user_id": "INTEGER",
        "contact_filter_json": "TEXT DEFAULT '{}'",
        "automation_enabled": "BOOLEAN DEFAULT FALSE",
        "scheduled_enabled": "BOOLEAN DEFAULT FALSE",
        "scheduled_at": "TIMESTAMP WITH TIME ZONE",
        "retry_enabled": "BOOLEAN DEFAULT FALSE",
        "drip_enabled": "BOOLEAN DEFAULT FALSE",
        "drip_action_name": "VARCHAR(150) DEFAULT ''",
        "drip_batch_quantity": "INTEGER DEFAULT 0",
        "drip_days_json": "TEXT DEFAULT '[]'",
        "drip_start_date": "VARCHAR(20) DEFAULT ''",
        "drip_timezone": "VARCHAR(80) DEFAULT 'Asia/Kolkata'",
        "drip_start_time": "VARCHAR(30) DEFAULT ''",
        "drip_end_time": "VARCHAR(30) DEFAULT ''",
    },
    "call_logs": {
        "user_id": "INTEGER",
    },
    "conversations": {
        "user_id": "INTEGER",
    },
    "knowledge_bases": {
        "user_id": "INTEGER",
    },
}


def main():
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as conn:
        for table, columns in COLUMNS.items():
            if table not in existing_tables:
                continue
            existing = {c["name"] for c in inspect(conn).get_columns(table)}
            for name, definition in columns.items():
                if name not in existing:
                    conn.execute(text(f'ALTER TABLE "{table}" ADD COLUMN "{name}" {definition}'))
                    print(f"Added {table}.{name}")

    # For the common single-user local development setup, attach legacy
    # unowned records to the first account. This makes the existing frontend
    # immediately see its old data after upgrading.
    db = SessionLocal()
    try:
        user = db.query(User).order_by(User.id.asc()).first()
        if user:
            if "assistants" in existing_tables:
                db.execute(text('UPDATE assistants SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "contacts" in existing_tables:
                db.execute(text('UPDATE contacts SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "segments" in existing_tables:
                db.execute(text('UPDATE segments SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "dialers" in existing_tables:
                db.execute(text('UPDATE dialers SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "knowledge_bases" in existing_tables:
                db.execute(text('UPDATE knowledge_bases SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "campaigns" in existing_tables:
                db.execute(text('UPDATE campaigns SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "call_logs" in existing_tables:
                db.execute(text('UPDATE call_logs SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            if "conversations" in existing_tables:
                db.execute(text('UPDATE conversations SET user_id = :uid WHERE user_id IS NULL'), {"uid": user.id})
            db.commit()
            print(f"Legacy records attached to user id {user.id}.")
    finally:
        db.close()

    print("Database migration completed.")


if __name__ == "__main__":
    main()
