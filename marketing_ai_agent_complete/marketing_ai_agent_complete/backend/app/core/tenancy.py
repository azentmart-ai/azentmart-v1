from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth import get_tenant_id_from_token


security = HTTPBearer()


def tenant_id_from_header(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UUID:
    """
    Extract the tenant ID from the JWT access token.

    The client must send:

    Authorization: Bearer <JWT_TOKEN>

    The tenant_id is taken from the verified JWT,
    instead of trusting a tenant ID supplied by the client.
    """

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer token.",
        )

    try:
        tenant_id = get_tenant_id_from_token(
            credentials.credentials
        )

        return UUID(tenant_id)

    except HTTPException:
        raise

    except (ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid tenant information in token.",
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )