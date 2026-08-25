from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy.engine import make_url
import psycopg

from app.config import settings


def main():
    # Read the SQLAlchemy database URL
    url = make_url(settings.database_url)

    if not url.drivername.startswith("postgresql"):
        print(
            "DATABASE_URL is not PostgreSQL; "
            "SQLAlchemy can create SQLite tables automatically."
        )
        return

    database = url.database

    if not database:
        raise SystemExit(
            "DATABASE_URL has no database name."
        )

    # Connect to PostgreSQL maintenance database.
    # psycopg needs postgresql://, not postgresql+psycopg://
    maintenance = url.set(
        drivername="postgresql",
        database="postgres"
    )

    conninfo = maintenance.render_as_string(
        hide_password=False
    )

    print(f"Connecting to PostgreSQL: {maintenance.host}")
    print(f"Checking database: {database}")

    try:
        with psycopg.connect(
            conninfo,
            autocommit=True
        ) as conn:

            exists = conn.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s",
                (database,),
            ).fetchone()

            if exists:
                print(
                    f"Database already exists: {database}"
                )
                return

            # Safely quote database name
            safe_name = database.replace('"', '""')

            conn.execute(
                f'CREATE DATABASE "{safe_name}"'
            )

            print(
                f"Created database successfully: {database}"
            )

    except psycopg.OperationalError as e:
        print("\nPostgreSQL connection failed.")
        print("Please check:")
        print("1. PostgreSQL service is running")
        print("2. PostgreSQL username is correct")
        print("3. PostgreSQL password is correct")
        print("4. PostgreSQL is running on port 5432")
        print(f"\nOriginal error: {e}")

        raise


if __name__ == "__main__":
    main()