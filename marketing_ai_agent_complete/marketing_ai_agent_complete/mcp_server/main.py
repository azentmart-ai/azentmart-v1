import re

from fastapi import FastAPI


app = FastAPI(
    title="Marketing MCP Tool Server",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tools")
def tools():
    return [
        {
            "name": "campaign_brief",
            "description": "Extract a structured marketing campaign brief from a user request.",
        },
        {
            "name": "hashtag_suggest",
            "description": "Generate relevant marketing hashtags from a product and audience.",
        },
    ]


def extract_campaign_details(task: str):
    """
    Extract product, target audience, goal and channels
    from the user's marketing request.

    Example:

    Create a marketing campaign for a premium electric bicycle
    targeting urban commuters.

    Result:

    Product  -> premium electric bicycle
    Audience -> urban commuters
    Goal     -> Create a marketing campaign
    """

    text = " ".join((task or "").split())

    # ---------------------------------------------------------
    # PRODUCT
    # ---------------------------------------------------------

    product_match = re.search(
        r"\bfor\s+(?:a|an|the)?\s*(.+?)\s+targeting\b",
        text,
        flags=re.IGNORECASE,
    )

    if product_match:
        product = product_match.group(1).strip(" .,:;")
    else:
        product = text.strip(" .,:;")

    # ---------------------------------------------------------
    # TARGET AUDIENCE
    # ---------------------------------------------------------

    audience_match = re.search(
        r"\btargeting\s+(.+?)(?:[.!?]|$)",
        text,
        flags=re.IGNORECASE,
    )

    if audience_match:
        audience = audience_match.group(1).strip(" .,:;")
    else:
        audience = "Target audience from the campaign brief"

    # ---------------------------------------------------------
    # CAMPAIGN GOAL
    # ---------------------------------------------------------

    lower_text = text.lower()

    if "create a marketing campaign" in lower_text:
        goal = "Create a marketing campaign"

    elif "marketing campaign" in lower_text:
        goal = "Create an effective marketing campaign"

    elif "increase sales" in lower_text:
        goal = "Increase sales"

    elif "generate leads" in lower_text:
        goal = "Generate qualified leads"

    elif "build awareness" in lower_text:
        goal = "Build brand awareness"

    else:
        goal = "Create an effective marketing campaign"

    # ---------------------------------------------------------
    # CHANNELS
    # ---------------------------------------------------------

    channels = ["Instagram", "Email"]

    if "linkedin" in lower_text and "LinkedIn" not in channels:
        channels.append("LinkedIn")

    if "facebook" in lower_text and "Facebook" not in channels:
        channels.append("Facebook")

    return {
        "product": product,
        "audience": audience,
        "goal": goal,
        "channels": channels,
    }


@app.post("/tools/campaign_brief")
def campaign_brief(payload: dict):

    # Prefer the complete user task.
    task = payload.get("task")

    if task:
        brief = extract_campaign_details(task)
    else:
        # Backward-compatible behavior
        brief = {
            "product": payload.get("product"),
            "audience": payload.get(
                "audience",
                "Target audience from the campaign brief",
            ),
            "goal": payload.get(
                "goal",
                "Create an effective marketing campaign",
            ),
            "channels": payload.get(
                "channels",
                ["Instagram", "Email"],
            ),
        }

    # Explicit values can override extracted values.
    if payload.get("product"):
        brief["product"] = payload["product"]

    if payload.get("audience"):
        brief["audience"] = payload["audience"]

    if payload.get("goal"):
        brief["goal"] = payload["goal"]

    if payload.get("channels"):
        brief["channels"] = payload["channels"]

    return {
        "tool": "campaign_brief",
        "brief": brief,
    }


def make_hashtags(product: str, audience: str):

    product_words = re.findall(
        r"[A-Za-z0-9]+",
        product or "",
    )

    audience_words = re.findall(
        r"[A-Za-z0-9]+",
        audience or "",
    )

    hashtags = []

    # ---------------------------------------------------------
    # PRODUCT HASHTAG
    # ---------------------------------------------------------

    if product_words:

        product_tag = "".join(
            word.capitalize()
            for word in product_words
        )

        hashtags.append(f"#{product_tag}")

    # ---------------------------------------------------------
    # PRODUCT-SPECIFIC HASHTAGS
    # ---------------------------------------------------------

    lower_product = (product or "").lower()

    if (
        "electric bicycle" in lower_product
        or "electric bike" in lower_product
        or "e-bike" in lower_product
        or "ebike" in lower_product
    ):

        hashtags.extend(
            [
                "#ElectricBike",
                "#EBike",
                "#ElectricBicycle",
                "#UrbanMobility",
            ]
        )

    elif "laptop" in lower_product:

        hashtags.extend(
            [
                "#Laptop",
                "#Tech",
                "#Technology",
                "#Productivity",
            ]
        )

    elif "gaming" in lower_product:

        hashtags.extend(
            [
                "#Gaming",
                "#GamingSetup",
                "#Gamer",
                "#PCGaming",
            ]
        )

    else:

        hashtags.extend(
            [
                "#Marketing",
                "#BrandStrategy",
                "#ContentMarketing",
            ]
        )

    # ---------------------------------------------------------
    # AUDIENCE HASHTAG
    # ---------------------------------------------------------

    if audience_words:

        audience_tag = "".join(
            word.capitalize()
            for word in audience_words[:3]
        )

        if audience_tag:

            audience_hashtag = f"#{audience_tag}"

            if audience_hashtag not in hashtags:
                hashtags.append(audience_hashtag)

    # ---------------------------------------------------------
    # REMOVE DUPLICATES
    # ---------------------------------------------------------

    unique_hashtags = []

    for tag in hashtags:

        if tag not in unique_hashtags:
            unique_hashtags.append(tag)

    return unique_hashtags[:6]


@app.post("/tools/hashtag_suggest")
def hashtag_suggest(payload: dict):

    product = payload.get("product", "")
    audience = payload.get("audience", "")

    # Backward compatibility with the old "topic" parameter.
    if not product:
        product = payload.get("topic", "marketing")

    hashtags = make_hashtags(
        product,
        audience,
    )

    return {
        "tool": "hashtag_suggest",
        "hashtags": hashtags,
    }   