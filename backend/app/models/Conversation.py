# Backward-compatible import.
# The canonical Conversation model lives in models.py so SQLAlchemy
# registers only one conversations table definition.
from .models import Conversation

__all__ = ["Conversation"]
