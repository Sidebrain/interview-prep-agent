import uuid
from pydantic import ValidationError


def check_uuid(value: str) -> str:
    try:
        prefix, uuid_string = value.split("-", 1)
        # Try converting string to UUID to validate format
        uuid.UUID(uuid_string)  # This will raise ValueError if invalid
    except ValueError as e:
        raise ValidationError(f"ID payload not UUID type: {e}")
    except Exception as e:
        raise ValidationError(f"Error in UUID format: {e}")
    return value
