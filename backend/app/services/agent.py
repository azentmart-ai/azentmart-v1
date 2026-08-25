from datetime import datetime, timezone, timedelta

from sqlalchemy.orm import Session

from ..models.models import (
    User,
    Assistant,
    Conversation,
    ConversationMessage,
    KnowledgeBase,
    CallLog,
    Campaign,
    Contact,
    Team,
    TeamMember,
    Dialer,
    Segment,
    UsageRecord,
    Subscription,
)

from .sarvam import chat, text_to_speech


# =========================================================
# TIME HELPERS
# =========================================================

def get_today_range():
    """
    Returns today's UTC start and tomorrow's UTC start.
    """

    now = datetime.now(timezone.utc)

    start = datetime(
        now.year,
        now.month,
        now.day,
        tzinfo=timezone.utc,
    )

    end = start + timedelta(days=1)

    return start, end


# =========================================================
# BUILD SYSTEM PROMPT
# =========================================================

def build_system_prompt(
    db: Session,
    assistant: Assistant,
    language: str,
) -> str:

    # -----------------------------------------------------
    # ASSISTANT CUSTOM PROMPT
    # -----------------------------------------------------

    custom_prompt = ""

    if assistant.system_prompt:
        custom_prompt = assistant.system_prompt.strip()


    # -----------------------------------------------------
    # GENERAL AI CORE INSTRUCTIONS
    # -----------------------------------------------------
    #
    # IMPORTANT:
    # These instructions are ALWAYS added.
    #
    # This prevents an old assistant.system_prompt stored
    # in PostgreSQL from restricting the AI to AzentMart
    # dashboard questions.
    #
    # -----------------------------------------------------

    general_ai_instruction = """
=========================================================
AZENTMART AI - CORE BEHAVIOR
=========================================================

You are AzentMart AI, a general-purpose intelligent AI
assistant with access to AzentMart-specific information.

VERY IMPORTANT:

You MUST answer ALL reasonable user questions.

You are NOT restricted to:
- calls
- campaigns
- contacts
- assistants
- teams
- dialers
- knowledge bases
- subscriptions
- dashboards
- AzentMart

You can answer normal general-purpose questions too.

=========================================================
GENERAL QUESTIONS
=========================================================

If the user asks a general question, answer it normally.

Examples:

User:
Explain Python.

You:
Python is a high-level programming language...

User:
What is machine learning?

You:
Machine learning is a branch of artificial intelligence...

User:
What is React?

You:
React is a JavaScript library used to build...

User:
Tell me a joke.

You:
Sure! Why did the programmer...

User:
What is 25 * 4?

You:
25 × 4 = 100.

User:
Write a Python program to reverse a string.

You:
Provide useful working Python code.

User:
Who invented the internet?

You:
Answer the question normally.

Do NOT respond with:
"I can only help with AzentMart..."
"I can only analyze your dashboard..."
"I can help with calls, campaigns and contacts..."

NEVER restrict a general question to AzentMart.

=========================================================
AZENTMART QUESTIONS
=========================================================

When the user asks about AzentMart, the application,
their dashboard, account, calls, campaigns, contacts,
assistants, teams, dialers, knowledge bases, credits,
subscriptions or usage:

Use the LIVE DATABASE INFORMATION supplied below.

The database is the source of truth for user-specific
AzentMart information.

Never invent:
- call counts
- campaign counts
- contact counts
- assistant counts
- credits
- names
- account information
- subscription information
- campaign status
- timings
- fees
- availability
- business policies

If the requested AzentMart information is not available
in the database or knowledge base, clearly say that the
information is currently unavailable.

=========================================================
KNOWLEDGE BASE
=========================================================

If knowledge-base information is provided, use it when
the user's question is related to that information.

Do NOT force knowledge-base information into unrelated
general questions.

For example:

User:
Explain Python.

Answer about Python.

Do NOT search for an AzentMart answer simply because
the AzentMart knowledge base exists.

=========================================================
CONVERSATION CONTEXT
=========================================================

Remember previous messages.

If the user asks a follow-up question, understand what
they are referring to.

Example:

User:
What is Python?

Assistant:
Python is a programming language...

User:
What is it used for?

Assistant:
Python is used for web development, automation,
data science, AI, scripting, and many other tasks.

Do NOT restart the conversation.

Do NOT pretend that every message is a new conversation.

=========================================================
FOLLOW-UP QUESTIONS
=========================================================

Understand short follow-up questions such as:

"why?"
"how?"
"what about yesterday?"
"and tomorrow?"
"how much?"
"can you explain?"
"what does that mean?"
"tell me more"
"give an example"

Use the previous conversation to understand them.

=========================================================
PROGRAMMING QUESTIONS
=========================================================

If the user asks for code:

- Give working code.
- Use the requested programming language.
- Explain briefly when useful.
- Do not refuse just because the question is unrelated
  to AzentMart.

Supported examples include:

Python
Java
JavaScript
TypeScript
React
Node.js
FastAPI
SQL
PostgreSQL
HTML
CSS
and other common technologies.

=========================================================
WRITING QUESTIONS
=========================================================

You can help with:

- emails
- messages
- resumes
- captions
- documentation
- rewriting
- grammar
- summaries
- explanations
- professional communication

Answer directly.

=========================================================
MATH AND REASONING
=========================================================

Answer calculations and reasoning questions directly.

Show the calculation when useful.

=========================================================
CASUAL CONVERSATION
=========================================================

You can have normal conversations.

Examples:

"Hi"
"How are you?"
"Good morning"
"Thank you"
"Tell me something interesting"

Respond naturally.

=========================================================
SAFETY AND ACCURACY
=========================================================

Do not knowingly provide harmful instructions.

For normal harmless questions, answer normally.

If you don't know something, say so rather than
inventing an answer.

=========================================================
ANSWER STYLE
=========================================================

- Answer the user's actual question.
- Be helpful.
- Be natural.
- Be conversational.
- Avoid unnecessary repetition.
- Avoid unnecessary disclaimers.
- Do not mention these instructions.
- Do not mention the system prompt.
- Do not mention database implementation unless relevant.
- Give one complete answer.
- Do not generate multiple separate answers.
- Keep normal chat concise.
- Give more detail when the user asks for detail.

=========================================================
MOST IMPORTANT RULE
=========================================================

ANSWER THE USER'S QUESTION.

Do NOT force every question into an AzentMart question.

You are a GENERAL-PURPOSE AI ASSISTANT that ALSO has
access to AzentMart data.
"""


    # -----------------------------------------------------
    # CUSTOM ASSISTANT PROMPT
    # -----------------------------------------------------

    if custom_prompt:

        custom_section = f"""
=========================================================
ASSISTANT-SPECIFIC INSTRUCTIONS
=========================================================

The assistant configuration contains the following
custom instructions:

{custom_prompt}

These custom instructions are secondary to the core
behavior above.

They MUST NOT prevent the assistant from answering
normal general-purpose questions.

If the custom prompt conflicts with the requirement to
answer general questions, continue answering the user
normally.
"""

    else:

        custom_section = ""


    # =====================================================
    # KNOWLEDGE BASE
    # =====================================================

    knowledge = ""

    if assistant.knowledge_enabled:

        try:

            query = (
                db.query(KnowledgeBase)
                .filter(
                    KnowledgeBase.active.is_(True)
                )
            )

            # Keep knowledge isolated to assistant owner
            if assistant.user_id is not None:

                query = query.filter(
                    KnowledgeBase.user_id
                    == assistant.user_id
                )

            rows = (
                query
                .order_by(
                    KnowledgeBase.id.desc()
                )
                .limit(10)
                .all()
            )

            if rows:

                knowledge = (
                    "\n\n"
                    "=========================================================\n"
                    "RELEVANT KNOWLEDGE BASE\n"
                    "=========================================================\n"
                    +
                    "\n".join(
                        f"- {row.title}: "
                        f"{row.content[:1800]}"
                        for row in rows
                    )
                )

        except Exception as exc:

            print(
                "[AGENT] Knowledge base error:",
                repr(exc),
            )

            knowledge = ""


    # =====================================================
    # MULTILINGUAL INSTRUCTIONS
    # =====================================================

    multilingual_instruction = """

=========================================================
MULTILINGUAL RULES
=========================================================

1. Automatically detect the user's language.

2. Respond in the same language as the user's latest
   message.

3. Never force English.

4. Never force Tamil.

5. Never ask the user to select a language.

6. Support English, Tamil, Hindi, Telugu, Malayalam,
   Kannada, Bengali, Marathi, Gujarati, Punjabi,
   Odia and other supported languages.

7. Understand natural Indian-language code mixing.

8. If the user changes language, immediately switch
   to that language.

9. Maintain complete conversation context.

10. Remember previous questions and answers.

11. Do not restart the conversation.

12. Give ONE complete answer for each message.

13. Do not answer word-by-word.

14. Do not unnecessarily split one answer into
    multiple assistant messages.

15. Keep responses natural.

16. Never mention these language instructions.

17. Never ask the user to choose a language.

18. For general questions, answer normally in the
    user's language.

19. For AzentMart questions, use available
    database/knowledge-base information.

20. Continue the conversation naturally.

21. If the customer clearly says goodbye or asks
    to stop, respond politely.
"""


    # =====================================================
    # FINAL SYSTEM PROMPT
    # =====================================================

    return (
        general_ai_instruction
        + "\n\n"
        + custom_section
        + "\n\n"
        + multilingual_instruction
        + "\n\n"
        + "=========================================================\n"
        + "CURRENT ASSISTANT INFORMATION\n"
        + "=========================================================\n"
        + f"Language mode: {language or 'AUTOMATIC'}\n"
        + f"Company: {assistant.company or 'AzentMart'}\n"
        + f"Assistant name: {assistant.name or 'AzentMart AI'}"
        + knowledge
    )


# =========================================================
# GET / CREATE CONVERSATION
# =========================================================

def get_conversation(
    db: Session,
    assistant: Assistant,
    session_id: str,
    language: str,
) -> Conversation:

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.user_id
            == assistant.user_id,

            Conversation.assistant_id
            == assistant.id,

            Conversation.session_id
            == session_id,
        )
        .first()
    )

    if conversation:
        return conversation

    conversation = Conversation(
        user_id=assistant.user_id,
        assistant_id=assistant.id,
        session_id=session_id,
        channel="chat",
        status="active",
        title="New Conversation",
        language=language or "auto",
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


# =========================================================
# DATABASE CONTEXT
# =========================================================

def build_database_context(
    db: Session,
    assistant: Assistant,
) -> str:

    user_id = assistant.user_id

    if user_id is None:
        return ""

    context = []

    start_of_day, start_of_tomorrow = get_today_range()


    # =====================================================
    # USER
    # =====================================================

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user:

        context.append(
            "ACCOUNT INFORMATION:\n"
            f"Name: {user.name}\n"
            f"Email: {user.email}\n"
            f"Role: {user.role}\n"
            f"Credits: {user.credits}\n"
            f"Active: {user.is_active}"
        )


    # =====================================================
    # CALLS
    # =====================================================

    total_calls = (
        db.query(CallLog)
        .filter(
            CallLog.user_id == user_id
        )
        .count()
    )

    today_calls = (
        db.query(CallLog)
        .filter(
            CallLog.user_id == user_id,
            CallLog.created_at >= start_of_day,
            CallLog.created_at < start_of_tomorrow,
        )
        .count()
    )

    completed_calls = (
        db.query(CallLog)
        .filter(
            CallLog.user_id == user_id,
            CallLog.status == "Completed",
        )
        .count()
    )

    total_call_duration = (
        db.query(CallLog)
        .filter(
            CallLog.user_id == user_id
        )
        .all()
    )

    duration_seconds = sum(
        call.duration_seconds or 0
        for call in total_call_duration
    )

    context.append(
        "CALL INFORMATION:\n"
        f"Total calls: {total_calls}\n"
        f"Today's calls: {today_calls}\n"
        f"Completed calls: {completed_calls}\n"
        f"Total call duration seconds: "
        f"{duration_seconds}"
    )


    # =====================================================
    # CALL PERFORMANCE
    # =====================================================

    calls = (
        db.query(CallLog)
        .filter(
            CallLog.user_id == user_id
        )
        .all()
    )

    if calls:

        total_cost = sum(
            call.cost or 0
            for call in calls
        )

        avg_latency = (
            sum(
                call.response_latency_ms or 0
                for call in calls
            )
            / len(calls)
        )

        context.append(
            "CALL PERFORMANCE:\n"
            f"Total call cost: {total_cost:.2f}\n"
            f"Average response latency: "
            f"{avg_latency:.0f} ms"
        )


    # =====================================================
    # CAMPAIGNS
    # =====================================================

    campaigns = (
        db.query(Campaign)
        .filter(
            Campaign.user_id == user_id
        )
        .all()
    )

    active_campaigns = [
        campaign
        for campaign in campaigns
        if str(campaign.status).upper() == "ACTIVE"
    ]

    context.append(
        "CAMPAIGN INFORMATION:\n"
        f"Total campaigns: {len(campaigns)}\n"
        f"Active campaigns: {len(active_campaigns)}"
    )

    if active_campaigns:

        campaign_lines = []

        for campaign in active_campaigns[:10]:

            campaign_lines.append(
                f"- {campaign.name}: "
                f"status={campaign.status}, "
                f"contacts={campaign.contacts}, "
                f"completed={campaign.completed}, "
                f"schedule={campaign.schedule}"
            )

        context.append(
            "ACTIVE CAMPAIGNS:\n"
            + "\n".join(campaign_lines)
        )


    # =====================================================
    # CONTACTS
    # =====================================================

    contacts_count = (
        db.query(Contact)
        .filter(
            Contact.user_id == user_id
        )
        .count()
    )

    active_contacts = (
        db.query(Contact)
        .filter(
            Contact.user_id == user_id,
            Contact.active.is_(True),
        )
        .count()
    )

    context.append(
        "CONTACT INFORMATION:\n"
        f"Total contacts: {contacts_count}\n"
        f"Active contacts: {active_contacts}"
    )


    # =====================================================
    # CONTACT STATUS
    # =====================================================

    contacts = (
        db.query(Contact)
        .filter(
            Contact.user_id == user_id
        )
        .all()
    )

    if contacts:

        status_counts = {}

        for contact in contacts:

            status = contact.status or "Unknown"

            status_counts[status] = (
                status_counts.get(status, 0) + 1
            )

        status_lines = [
            f"- {status}: {count}"
            for status, count
            in status_counts.items()
        ]

        context.append(
            "CONTACT STATUS:\n"
            + "\n".join(status_lines)
        )


    # =====================================================
    # ASSISTANTS
    # =====================================================

    assistants = (
        db.query(Assistant)
        .filter(
            Assistant.user_id == user_id
        )
        .all()
    )

    active_assistants = [
        item
        for item in assistants
        if item.active
    ]

    context.append(
        "ASSISTANT INFORMATION:\n"
        f"Total assistants: {len(assistants)}\n"
        f"Active assistants: {len(active_assistants)}"
    )


    # =====================================================
    # ASSISTANT CALL COUNTS
    # =====================================================

    assistant_call_lines = []

    for item in assistants:

        call_count = (
            db.query(CallLog)
            .filter(
                CallLog.user_id == user_id,
                CallLog.assistant_id == item.id,
            )
            .count()
        )

        assistant_call_lines.append(
            f"- {item.name}: "
            f"{call_count} calls"
        )

    if assistant_call_lines:

        context.append(
            "CALLS BY ASSISTANT:\n"
            + "\n".join(assistant_call_lines)
        )


    # =====================================================
    # DIALERS
    # =====================================================

    dialers = (
        db.query(Dialer)
        .filter(
            Dialer.user_id == user_id
        )
        .all()
    )

    context.append(
        "DIALER INFORMATION:\n"
        f"Total dialers: {len(dialers)}"
    )

    if dialers:

        dialer_lines = []

        for dialer in dialers:

            dialer_lines.append(
                f"- {dialer.name}: "
                f"type={dialer.type}, "
                f"status={dialer.status}, "
                f"calls={dialer.calls}"
            )

        context.append(
            "DIALERS:\n"
            + "\n".join(dialer_lines)
        )


    # =====================================================
    # KNOWLEDGE BASE COUNT
    # =====================================================

    knowledge_count = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.user_id == user_id,
            KnowledgeBase.active.is_(True),
        )
        .count()
    )

    context.append(
        "KNOWLEDGE BASE:\n"
        f"Active knowledge entries: "
        f"{knowledge_count}"
    )


    # =====================================================
    # TEAMS
    # =====================================================

    teams = (
        db.query(Team)
        .filter(
            Team.owner_id == user_id
        )
        .all()
    )

    context.append(
        "TEAM INFORMATION:\n"
        f"Total teams: {len(teams)}"
    )

    if teams:

        team_lines = []

        for team in teams:

            member_count = (
                db.query(TeamMember)
                .filter(
                    TeamMember.team_id == team.id
                )
                .count()
            )

            team_lines.append(
                f"- {team.name}: "
                f"{member_count} members"
            )

        context.append(
            "TEAMS:\n"
            + "\n".join(team_lines)
        )


    # =====================================================
    # SUBSCRIPTION
    # =====================================================

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user_id,
            Subscription.status == "ACTIVE",
        )
        .order_by(
            Subscription.id.desc()
        )
        .first()
    )

    if subscription:

        context.append(
            "SUBSCRIPTION:\n"
            f"Plan: {subscription.plan_name}\n"
            f"Status: {subscription.status}\n"
            f"Minutes limit: "
            f"{subscription.minutes_limit}\n"
            f"Token limit: "
            f"{subscription.tokens_limit}"
        )


    return "\n\n".join(context)


# =========================================================
# GENERATE TEXT REPLY
# =========================================================

async def generate_reply(
    db: Session,
    assistant: Assistant,
    session_id: str,
    language: str,
    user_text: str,
):

    # =====================================================
    # VALIDATE USER MESSAGE
    # =====================================================

    user_text = (user_text or "").strip()

    if not user_text:

        return (
            "I'm here and ready to help. "
            "What would you like to know?"
        )


    # =====================================================
    # GET CONVERSATION
    # =====================================================

    conversation = get_conversation(
        db=db,
        assistant=assistant,
        session_id=session_id,
        language=language,
    )


    # =====================================================
    # GET PREVIOUS MESSAGES
    # =====================================================

    message_rows = (
        db.query(ConversationMessage)
        .filter(
            ConversationMessage.conversation_id
            == conversation.id
        )
        .order_by(
            ConversationMessage.created_at.desc()
        )
        .limit(20)
        .all()
    )


    history = []

    for row in reversed(message_rows):

        # -------------------------------------------------
        # IMPORTANT
        #
        # chat.py already saves the current user message
        # before calling generate_reply().
        #
        # Do not add that same message twice.
        # -------------------------------------------------

        if (
            row.sender_type == "user"
            and row.message == user_text
        ):
            continue


        role = (
            "assistant"
            if row.sender_type == "assistant"
            else "user"
        )

        history.append(
            {
                "role": role,
                "content": row.message,
            }
        )


    # =====================================================
    # SYSTEM PROMPT
    # =====================================================

    system_prompt = build_system_prompt(
        db,
        assistant,
        language,
    )


    # =====================================================
    # DATABASE CONTEXT
    # =====================================================

    database_context = ""

    try:

        database_context = build_database_context(
            db,
            assistant,
        )

    except Exception as exc:

        print(
            "[AGENT] Database context error:",
            repr(exc),
        )

        database_context = ""


    # =====================================================
    # ADD DATABASE CONTEXT
    # =====================================================

    if database_context:

        system_prompt += (
            "\n\n"
            "=========================================================\n"
            "LIVE DATABASE INFORMATION\n"
            "=========================================================\n"
            "\n"
            "The following information belongs to the currently "
            "authenticated AzentMart user.\n"
            "\n"
            "Use this information ONLY when the user's question "
            "requires AzentMart/account/dashboard information.\n"
            "\n"
            "IMPORTANT:\n"
            "- Never invent database values.\n"
            "- Never change database values.\n"
            "- Use the supplied values as the source of truth.\n"
            "- If a requested value is not present, say it is "
            "unavailable.\n"
            "- Do NOT use this database context to restrict "
            "general questions.\n"
            "\n"
            f"{database_context}"
        )


    # =====================================================
    # BUILD AI MESSAGES
    # =====================================================

    messages = [
        {
            "role": "system",
            "content": system_prompt,
        }
    ]


    # -----------------------------------------------------
    # ADD CONVERSATION HISTORY
    # -----------------------------------------------------

    messages.extend(history)


    # -----------------------------------------------------
    # ADD CURRENT USER MESSAGE
    # -----------------------------------------------------

    messages.append(
        {
            "role": "user",
            "content": user_text,
        }
    )


    # =====================================================
    # DEBUG
    # =====================================================

    print(
        "\n"
        "========================================\n"
        "[AGENT] USER QUESTION\n"
        "========================================"
    )

    print(user_text)

    print(
        "\n"
        "========================================\n"
        "[AGENT] ASSISTANT\n"
        "========================================"
    )

    print(
        assistant.name
    )

    print(
        "\n"
        "========================================\n"
        "[AGENT] HISTORY MESSAGES\n"
        "========================================"
    )

    print(
        len(history)
    )


    # =====================================================
    # CALL SARVAM AI
    # =====================================================

    try:

        reply = await chat(messages)

    except Exception as exc:

        print(
            "[AGENT] AI generation error:",
            repr(exc),
        )

        raise


    # =====================================================
    # CLEAN RESPONSE
    # =====================================================

    if not reply:

        return (
            "I'm sorry, I couldn't generate a response "
            "right now. Please try again."
        )


    return reply.strip()


# =========================================================
# GENERATE VOICE REPLY
# =========================================================

async def generate_voice_reply(
    db: Session,
    assistant: Assistant,
    session_id: str,
    language: str,
    user_text: str,
):

    reply = await generate_reply(
        db,
        assistant,
        session_id,
        language,
        user_text,
    )


    audio_b64, content_type = await text_to_speech(
        reply,
        language,
    )


    return (
        reply,
        audio_b64,
        content_type,
    )