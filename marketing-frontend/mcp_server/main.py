import re
import html
from urllib.parse import urlparse, parse_qs, quote_plus
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

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
        {
            "name": "web_research",
            "description": "Search the web and return research results relevant to a marketing query.",
        },
        {
            "name": "fetch_website",
            "description": "Fetch readable text content from a public website URL for SEO analysis.",
        },
    ]


# ============================================================
# EXISTING CAMPAIGN BRIEF TOOL
# ============================================================

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


# ============================================================
# EXISTING HASHTAG TOOL
# ============================================================

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


# ============================================================
# WEB / WEBSITE HELPERS
# ============================================================

def clean_html(raw_html: str) -> str:
    """
    Convert basic HTML into readable text.
    """

    if not raw_html:
        return ""

    text = raw_html

    # Remove scripts
    text = re.sub(
        r"<script\b[^>]*>.*?</script>",
        " ",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    # Remove styles
    text = re.sub(
        r"<style\b[^>]*>.*?</style>",
        " ",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )

    # Remove comments
    text = re.sub(
        r"<!--.*?-->",
        " ",
        text,
        flags=re.DOTALL,
    )

    # Remove HTML tags
    text = re.sub(
        r"<[^>]+>",
        " ",
        text,
    )

    # Decode HTML entities
    text = html.unescape(text)

    # Normalize whitespace
    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


def clean_search_url(url: str) -> str:
    """
    Convert a DuckDuckGo redirect URL into the real destination URL.
    """

    if not url:
        return ""

    url = html.unescape(
        url.strip()
    )

    # Handle protocol-relative URL.
    if url.startswith("//"):
        url = "https:" + url

    try:

        parsed = urlparse(url)

        # DuckDuckGo redirect:
        # https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com
        if (
            "duckduckgo.com" in parsed.netloc
            and parsed.path.startswith("/l/")
        ):

            query_params = parse_qs(
                parsed.query
            )

            destination = query_params.get(
                "uddg"
            )

            if destination:
                return destination[0]

    except Exception:
        pass

    return url


# ============================================================
# WEBSITE FETCH
# ============================================================

def fetch_url(
    url: str,
    max_chars: int = 7000,
):
    """
    Fetch a public HTTP/HTTPS URL and return readable text.
    """

    url = (url or "").strip()

    if not url:
        return {
            "success": False,
            "error": "URL was not provided.",
        }

    parsed = urlparse(url)

    if parsed.scheme not in (
        "http",
        "https",
    ):
        return {
            "success": False,
            "error": "Only HTTP and HTTPS URLs are supported.",
        }

    try:

        request = Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "Chrome/154.0 Safari/537.36"
                )
            },
        )

        with urlopen(
            request,
            timeout=10,
        ) as response:

            content_type = response.headers.get(
                "Content-Type",
                "",
            )

            raw = response.read(
                2_000_000
            )

            encoding = "utf-8"

            charset_match = re.search(
                r"charset=([A-Za-z0-9_-]+)",
                content_type,
                flags=re.IGNORECASE,
            )

            if charset_match:
                encoding = charset_match.group(1)

            try:

                decoded = raw.decode(
                    encoding,
                    errors="ignore",
                )

            except Exception:

                decoded = raw.decode(
                    "utf-8",
                    errors="ignore",
                )

            readable_text = clean_html(
                decoded
            )

            return {
                "success": True,
                "url": url,
                "content_type": content_type,
                "text": readable_text[:max_chars],
                "characters": len(readable_text),
            }

    except HTTPError as exc:

        return {
            "success": False,
            "url": url,
            "error": f"HTTP error {exc.code}",
        }

    except URLError as exc:

        return {
            "success": False,
            "url": url,
            "error": f"URL error: {exc.reason}",
        }

    except Exception as exc:

        return {
            "success": False,
            "url": url,
            "error": f"Website fetch failed: {str(exc)}",
        }


# ============================================================
# EXISTING NEW WEBSITE FETCH TOOL
# ============================================================

@app.post("/tools/fetch_website")
def fetch_website(payload: dict):

    url = payload.get(
        "url",
        "",
    )

    max_chars = payload.get(
        "max_chars",
        7000,
    )

    try:
        max_chars = int(max_chars)
    except Exception:
        max_chars = 7000

    max_chars = max(
        1000,
        min(max_chars, 12000),
    )

    result = fetch_url(
        url,
        max_chars=max_chars,
    )

    return {
        "tool": "fetch_website",
        **result,
    }


# ============================================================
# WEB SEARCH
# ============================================================

def search_web(
    query: str,
    max_results: int = 5,
):
    """
    Search the web using DuckDuckGo HTML results.

    Returns:
        title
        url
        snippet

    The search result URLs are cleaned so that
    DuckDuckGo redirect URLs are converted into
    the actual destination URLs.
    """

    query = " ".join(
        (query or "").split()
    ).strip()

    if not query:

        return {
            "success": False,
            "query": query,
            "results": [],
            "error": "Search query was not provided.",
        }

    try:
        max_results = int(
            max_results
        )
    except Exception:
        max_results = 5

    max_results = max(
        1,
        min(max_results, 8),
    )

    search_url = (
        "https://html.duckduckgo.com/html/?q="
        + quote_plus(query)
    )

    try:

        request = Request(
            search_url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "Chrome/154.0 Safari/537.36"
                )
            },
        )

        with urlopen(
            request,
            timeout=10,
        ) as response:

            raw = response.read(
                2_000_000
            )

            page = raw.decode(
                "utf-8",
                errors="ignore",
            )

        results = []

        # =====================================================
        # RESULT LINKS
        # =====================================================

        link_matches = re.findall(
            r'<a[^>]+class=["\'][^"\']*result__a[^"\']*["\'][^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
            page,
            flags=re.IGNORECASE | re.DOTALL,
        )

        # Some DuckDuckGo HTML responses place href before class.
        if not link_matches:

            link_matches = re.findall(
                r'<a[^>]+href=["\']([^"\']+)["\'][^>]+class=["\'][^"\']*result__a[^"\']*["\'][^>]*>(.*?)</a>',
                page,
                flags=re.IGNORECASE | re.DOTALL,
            )

        # =====================================================
        # RESULT SNIPPETS
        # =====================================================

        snippet_matches = re.findall(
            r'<(?:a|div)[^>]+class=["\'][^"\']*result__snippet[^"\']*["\'][^>]*>(.*?)</(?:a|div)>',
            page,
            flags=re.IGNORECASE | re.DOTALL,
        )

        # =====================================================
        # BUILD RESULTS
        # =====================================================

        for index, (
            raw_url,
            raw_title,
        ) in enumerate(
            link_matches
        ):

            if len(results) >= max_results:
                break

            title = clean_html(
                raw_title
            )

            result_url = clean_search_url(
                raw_url
            )

            snippet = ""

            if index < len(
                snippet_matches
            ):

                snippet = clean_html(
                    snippet_matches[index]
                )

            if not title:
                continue

            if not result_url:
                continue

            results.append(
                {
                    "title": title,
                    "url": result_url,
                    "snippet": snippet,
                }
            )

        # =====================================================
        # FALLBACK RESULT PARSER
        # =====================================================

        if not results:

            # Search for generic result links.
            fallback_links = re.findall(
                r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                page,
                flags=re.IGNORECASE | re.DOTALL,
            )

            for (
                raw_url,
                raw_title,
            ) in fallback_links:

                result_url = clean_search_url(
                    raw_url
                )

                title = clean_html(
                    raw_title
                )

                # Only keep meaningful external results.
                if not title:
                    continue

                if not result_url:
                    continue

                if result_url.startswith("#"):
                    continue

                if (
                    "duckduckgo.com"
                    in urlparse(
                        result_url
                    ).netloc
                    and "/l/"
                    not in result_url
                ):
                    continue

                results.append(
                    {
                        "title": title,
                        "url": result_url,
                        "snippet": "",
                    }
                )

                if len(results) >= max_results:
                    break

        # =====================================================
        # IF SNIPPETS ARE STILL EMPTY
        # =====================================================
        #
        # Some search-result HTML responses may not expose
        # snippets in the exact expected class.
        #
        # In that situation, fetch the first few public
        # result pages and create a short readable context.
        #
        # This gives Market Research useful source content
        # instead of only titles and URLs.
        #
        # =====================================================

        for result in results:

            if result["snippet"]:
                continue

            source_url = result["url"]

            # Skip obviously unsupported URLs.
            if not source_url.startswith(
                (
                    "http://",
                    "https://",
                )
            ):
                continue

            try:

                fetched = fetch_url(
                    source_url,
                    max_chars=1800,
                )

                if fetched.get(
                    "success"
                ):

                    source_text = (
                        fetched.get(
                            "text",
                            "",
                        )
                        or ""
                    )

                    if source_text:

                        result["snippet"] = (
                            source_text[:1800]
                        )

            except Exception:

                continue

        return {
            "success": True,
            "query": query,
            "results": results,
            "result_count": len(results),
        }

    except HTTPError as exc:

        return {
            "success": False,
            "query": query,
            "results": [],
            "error": f"Search HTTP error {exc.code}",
        }

    except URLError as exc:

        return {
            "success": False,
            "query": query,
            "results": [],
            "error": f"Search URL error: {exc.reason}",
        }

    except Exception as exc:

        return {
            "success": False,
            "query": query,
            "results": [],
            "error": f"Web search failed: {str(exc)}",
        }


# ============================================================
# WEB RESEARCH TOOL
# ============================================================

@app.post("/tools/web_research")
def web_research(payload: dict):

    query = payload.get(
        "query",
        "",
    )

    max_results = payload.get(
        "max_results",
        5,
    )

    result = search_web(
        query,
        max_results=max_results,
    )

    return {
        "tool": "web_research",
        **result,
    }