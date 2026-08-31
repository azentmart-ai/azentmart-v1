import re
import requests

from ..config import settings


def normalize_phone_number(phone_number: str) -> str:
    """
    Normalize a phone number into E.164 format.

    Examples:
        9876543210       -> +919876543210
        919876543210     -> +919876543210
        +919876543210    -> +919876543210
    """

    if not phone_number:
        return ""

    phone = str(phone_number).strip()

    # Remove spaces, -, (, ), dots, etc.
    phone = re.sub(r"[^\d+]", "", phone)

    # Already E.164
    if phone.startswith("+"):
        return phone

    # Indian 10-digit number
    if len(phone) == 10 and phone.isdigit():
        return f"+91{phone}"

    # Indian number without +
    if len(phone) == 12 and phone.startswith("91"):
        return f"+{phone}"

    # Generic international number without +
    if phone.isdigit():
        return f"+{phone}"

    return phone


def make_bolna_call(
    agent_id: str,
    recipient_phone_number: str,
    from_phone_number: str | None = None,
    user_data: dict | None = None,
):
    """
    Start an outbound AI voice call using Bolna.

    Bolna handles:
    - Telephony
    - Speech-to-Text
    - LLM conversation
    - Text-to-Speech
    - Voice agent conversation

    IMPORTANT:
    The from_phone_number must be a phone number that
    exists in the telephony provider configured for the
    Bolna agent.

    For Plivo, the number must belong to your Plivo/Bolna
    telephony configuration.
    """

    # =========================================================
    # VALIDATE BOLNA API KEY
    # =========================================================

    if not settings.bolna_api_key:
        raise RuntimeError(
            "BOLNA_API_KEY is not configured in .env"
        )

    # =========================================================
    # VALIDATE AGENT ID
    # =========================================================

    if not agent_id or not agent_id.strip():
        raise ValueError(
            "Bolna agent_id is required."
        )

    # =========================================================
    # VALIDATE RECIPIENT
    # =========================================================

    if not recipient_phone_number or not recipient_phone_number.strip():
        raise ValueError(
            "Recipient phone number is required."
        )

    # =========================================================
    # NORMALIZE VALUES
    # =========================================================

    agent_id = agent_id.strip()

    recipient_phone_number = normalize_phone_number(
        recipient_phone_number
    )

    if not recipient_phone_number:
        raise ValueError(
            "Invalid recipient phone number."
        )

    # =========================================================
    # NORMALIZE FROM NUMBER
    # =========================================================

    normalized_from_number = None

    if from_phone_number:
        normalized_from_number = normalize_phone_number(
            from_phone_number
        )

    # =========================================================
    # VALIDATE PHONE NUMBER FORMAT
    # =========================================================

    if not recipient_phone_number.startswith("+"):
        raise ValueError(
            f"Recipient phone number must be in E.164 format. "
            f"Received: {recipient_phone_number}"
        )

    if normalized_from_number and not normalized_from_number.startswith("+"):
        raise ValueError(
            f"From phone number must be in E.164 format. "
            f"Received: {normalized_from_number}"
        )

    # =========================================================
    # BOLNA API URL
    # =========================================================

    base_url = (
        settings.bolna_base_url
        or "https://api.bolna.ai"
    ).rstrip("/")

    url = f"{base_url}/call"

    # =========================================================
    # HEADERS
    # =========================================================

    headers = {
        "Authorization": f"Bearer {settings.bolna_api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    # =========================================================
    # REQUEST PAYLOAD
    # =========================================================

    payload = {
        "agent_id": agent_id,
        "recipient_phone_number": recipient_phone_number,
        "user_data": user_data or {},
    }

    # =========================================================
    # IMPORTANT:
    # Only send from_phone_number when it is provided.
    #
    # If it is omitted, Bolna can use the phone configuration
    # associated with the agent.
    # =========================================================

    if normalized_from_number:
        payload["from_phone_number"] = normalized_from_number

    # =========================================================
    # DEBUG INFORMATION
    # =========================================================

    print()
    print("=" * 70)
    print("📞 BOLNA OUTBOUND CALL")
    print("=" * 70)

    print("URL:", url)
    print("Agent ID:", agent_id)
    print("Recipient:", recipient_phone_number)

    if normalized_from_number:
        print("From:", normalized_from_number)
    else:
        print("From: Using Bolna agent/default telephony number")

    print("User Data:", user_data or {})

    print("=" * 70)

    # =========================================================
    # SEND REQUEST
    # =========================================================

    try:

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=30,
        )

    except requests.Timeout as exc:

        print("❌ Bolna request timed out")

        raise RuntimeError(
            "Bolna API request timed out."
        ) from exc

    except requests.RequestException as exc:

        print("❌ Bolna connection error:")
        print(str(exc))

        raise RuntimeError(
            f"Could not connect to Bolna: {exc}"
        ) from exc

    # =========================================================
    # RESPONSE
    # =========================================================

    print()
    print("=" * 70)
    print("📡 BOLNA RESPONSE")
    print("=" * 70)

    print("HTTP Status:", response.status_code)
    print("Response:", response.text)

    print("=" * 70)

    # =========================================================
    # PARSE RESPONSE
    # =========================================================

    try:
        response_data = response.json()

    except ValueError:
        response_data = {
            "status_code": response.status_code,
            "response": response.text,
        }

    # =========================================================
    # HANDLE API ERROR
    # =========================================================

    if not response.ok:

        error_message = response_data

        if isinstance(response_data, dict):

            error_message = (
                response_data.get("message")
                or response_data.get("error")
                or response_data
            )

        print()
        print("=" * 70)
        print("❌ BOLNA CALL FAILED")
        print("=" * 70)

        print("Status:", response.status_code)
        print("Error:", error_message)

        print("=" * 70)

        # Specific Plivo caller-ID error
        if (
            "calling_from_number" in str(error_message).lower()
            or "from_number" in str(error_message).lower()
            or "doesn't exist for plivo" in str(error_message).lower()
        ):
            raise RuntimeError(
                "Bolna rejected the caller number. "
                f"The number '{normalized_from_number}' "
                "is not registered/available in the Plivo "
                "telephony configuration used by this Bolna agent. "
                "Add the correct Plivo number to Bolna and use "
                "that exact number in E.164 format."
            )

        raise RuntimeError(
            f"Bolna API error {response.status_code}: "
            f"{error_message}"
        )

    # =========================================================
    # SUCCESS RESPONSE
    # =========================================================

    result = response_data

    # =========================================================
    # SUCCESS LOG
    # =========================================================

    print()
    print("=" * 70)
    print("✅ BOLNA CALL CREATED")
    print("=" * 70)

    print("Status:", result.get("status"))
    print("Execution ID:", result.get("execution_id"))
    print("Message:", result.get("message"))

    print("=" * 70)

    return result