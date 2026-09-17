from .strategy import StrategyAgent
from .content import ContentAgent
from .email import EmailAgent
from .social_media import SocialMediaAgent
from .seo import SEOAgent
from .ads import AdsAgent
from .market_research import MarketResearchAgent
from .campaign_analyst import CampaignAnalystAgent

from app.mcp.client import call_tool


class MarketingOrchestrator:

    # -------------------------------------------------------------
    # COMPACT TEXT HELPER
    # -------------------------------------------------------------
    #
    # Full Campaign mode runs several LLM calls.
    # Passing very large outputs between agents increases Groq TPM
    # usage significantly.
    #
    # Individual agent mode does NOT use this helper.
    # Therefore individual-agent output quality/settings remain
    # unchanged.
    # -------------------------------------------------------------

    def _compact_output(self, text, max_chars=1800):
        if not text:
            return "No output provided."

        text = str(text)

        if len(text) <= max_chars:
            return text

        head_size = max_chars // 2
        tail_size = max_chars - head_size

        return (
            text[:head_size]
            + "\n\n...[COMPACTED FOR TOKEN EFFICIENCY]...\n\n"
            + text[-tail_size:]
        )

    # -------------------------------------------------------------
    # COMPACT CONTEXT HELPER
    # -------------------------------------------------------------

    def _compact_context(self, text, max_chars=2800):
        if not text:
            return ""

        text = str(text)

        if len(text) <= max_chars:
            return text

        head_size = max_chars // 2
        tail_size = max_chars - head_size

        return (
            text[:head_size]
            + "\n\n...[CONTEXT COMPACTED FOR TOKEN EFFICIENCY]...\n\n"
            + text[-tail_size:]
        )

    # -------------------------------------------------------------
    # FULL CAMPAIGN AGENT RUNNER
    # -------------------------------------------------------------
    #
    # Full campaign mode uses smaller output budgets to stay within
    # the current Groq 8000 TPM organization limit.
    #
    # Individual mode does not use this method.
    # -------------------------------------------------------------

    def _run_full_agent(self, agent_instance, task, context, max_tokens=400):
        agent_instance.max_tokens = max_tokens
        return agent_instance.run(task, context)

    def run(self, task, context="", memory="", agent=None):

        # ---------------------------------------------------------
        # 1. MCP CAMPAIGN BRIEF
        # ---------------------------------------------------------

        campaign_brief = call_tool(
            "campaign_brief",
            {
                "task": task
            }
        )

        brief = campaign_brief.get("brief", {})

        product = brief.get("product") or "marketing campaign"
        audience = brief.get("audience") or "target audience"

        # ---------------------------------------------------------
        # 2. MCP HASHTAG SUGGESTION
        # ---------------------------------------------------------

        hashtag_result = call_tool(
            "hashtag_suggest",
            {
                "product": product,
                "audience": audience
            }
        )

        # ---------------------------------------------------------
        # 3. MCP CONTEXT
        # ---------------------------------------------------------

        mcp_context = (
            "\n\nMCP CAMPAIGN BRIEF:\n"
            + str(campaign_brief)
            + "\n\nMCP HASHTAG SUGGESTIONS:\n"
            + str(hashtag_result)
        )

        full_context = context + mcp_context

        # ---------------------------------------------------------
        # 4. INDIVIDUAL AGENT MODE
        # ---------------------------------------------------------
        #
        # IMPORTANT:
        # Individual agents continue using their own max_tokens
        # exactly as configured in their agent files.
        #
        # ---------------------------------------------------------

        if agent:

            agent_name = agent.lower().strip()

            if agent_name in ["strategy", "marketing"]:
                output = StrategyAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "strategy",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name == "content":
                output = ContentAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "content",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name in ["social_media", "social media", "social"]:
                output = SocialMediaAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "social_media",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name == "seo":
                output = SEOAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "seo",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name == "ads":
                output = AdsAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "ads",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name in [
                "email",
                "email_marketing",
                "email marketing"
            ]:
                output = EmailAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "email",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name in [
                "market_research",
                "market research",
                "research"
            ]:
                output = MarketResearchAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "market_research",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            if agent_name in [
                "campaign_analyst",
                "campaign analyst",
                "analyst"
            ]:
                output = CampaignAnalystAgent().run(
                    task,
                    full_context
                )

                return {
                    "agent": "campaign_analyst",
                    "output": output,
                    "mcp_campaign_brief": campaign_brief,
                    "mcp_hashtags": hashtag_result
                }

            # -----------------------------------------------------
            # UNKNOWN AGENT
            # -----------------------------------------------------

            return {
                "agent": agent_name,
                "output": (
                    "Unknown marketing agent. "
                    "Available agents: strategy, content, "
                    "social_media, seo, ads, email, "
                    "market_research, campaign_analyst."
                ),
                "mcp_campaign_brief": campaign_brief,
                "mcp_hashtags": hashtag_result
            }

        # ---------------------------------------------------------
        # 5. FULL MULTI-AGENT CAMPAIGN MODE
        # ---------------------------------------------------------
        #
        # All 8 AI Employees participate.
        #
        # Token-efficient execution is used ONLY here.
        #
        # ---------------------------------------------------------

        # Keep the original task and important MCP information,
        # but prevent unnecessarily large RAG/memory context from
        # being repeated across every LLM call.
        compact_full_context = self._compact_context(
            full_context,
            max_chars=2800
        )

        # ---------------------------------------------------------
        # 5A. STRATEGY AGENT
        # ---------------------------------------------------------

        strategy_agent = StrategyAgent()

        strategy = self._run_full_agent(
            strategy_agent,
            task,
            compact_full_context,
            max_tokens=450
        )

        # Compact strategy before passing it to multiple downstream
        # agents. The complete strategy is still preserved in the
        # final response.
        compact_strategy = self._compact_output(
            strategy,
            max_chars=1800
        )

        # ---------------------------------------------------------
        # 5B. CONTENT AGENT
        # ---------------------------------------------------------

        content_agent = ContentAgent()

        content_context = (
            compact_full_context
            + "\n\nSTRATEGY AGENT OUTPUT:\n"
            + compact_strategy
        )

        content = self._run_full_agent(
            content_agent,
            task,
            content_context,
            max_tokens=450
        )

        # ---------------------------------------------------------
        # 5C. SOCIAL MEDIA AGENT
        # ---------------------------------------------------------

        social_media_agent = SocialMediaAgent()

        social_context = (
            compact_full_context
            + "\n\nSTRATEGY AGENT OUTPUT:\n"
            + compact_strategy
        )

        social_media = self._run_full_agent(
            social_media_agent,
            task,
            social_context,
            max_tokens=450
        )

        # ---------------------------------------------------------
        # 5D. SEO AGENT
        # ---------------------------------------------------------

        seo_agent = SEOAgent()

        seo_context = (
            compact_full_context
            + "\n\nSTRATEGY AGENT OUTPUT:\n"
            + compact_strategy
        )

        seo = self._run_full_agent(
            seo_agent,
            task,
            seo_context,
            max_tokens=450
        )

        compact_seo = self._compact_output(
            seo,
            max_chars=1800
        )

        # ---------------------------------------------------------
        # 5E. ADS AGENT
        # ---------------------------------------------------------

        ads_agent = AdsAgent()

        ads_context = (
            compact_full_context
            + "\n\nSTRATEGY AGENT OUTPUT:\n"
            + compact_strategy
            + "\n\nSEO AGENT OUTPUT:\n"
            + compact_seo
        )

        ads = self._run_full_agent(
            ads_agent,
            task,
            ads_context,
            max_tokens=450
        )

        # ---------------------------------------------------------
        # 5F. EMAIL AGENT
        # ---------------------------------------------------------

        email_agent = EmailAgent()

        email_context = (
            compact_full_context
            + "\n\nSTRATEGY AGENT OUTPUT:\n"
            + compact_strategy
        )

        email = self._run_full_agent(
            email_agent,
            task,
            email_context,
            max_tokens=450
        )

        # ---------------------------------------------------------
        # 5G. MARKET RESEARCH AGENT
        # ---------------------------------------------------------

        market_research_agent = MarketResearchAgent()

        market_research = self._run_full_agent(
            market_research_agent,
            task,
            compact_full_context,
            max_tokens=450
        )

        # ---------------------------------------------------------
        # 5H. CAMPAIGN ANALYST
        # ---------------------------------------------------------
        #
        # Campaign Analyst receives compact versions of all
        # specialized employee outputs.
        #
        # This prevents the previous 413/429 Groq TPM errors while
        # still allowing the analyst to understand the coordinated
        # campaign.
        #
        # ---------------------------------------------------------

        compact_content = self._compact_output(
            content,
            max_chars=1400
        )

        compact_social_media = self._compact_output(
            social_media,
            max_chars=1400
        )

        compact_ads = self._compact_output(
            ads,
            max_chars=1400
        )

        compact_email = self._compact_output(
            email,
            max_chars=1400
        )

        compact_market_research = self._compact_output(
            market_research,
            max_chars=1400
        )

        analyst_context = (
            compact_full_context
            + "\n\nSTRATEGY AGENT OUTPUT:\n"
            + compact_strategy
            + "\n\nCONTENT AGENT OUTPUT:\n"
            + compact_content
            + "\n\nSOCIAL MEDIA AGENT OUTPUT:\n"
            + compact_social_media
            + "\n\nSEO AGENT OUTPUT:\n"
            + compact_seo
            + "\n\nADS AGENT OUTPUT:\n"
            + compact_ads
            + "\n\nEMAIL AGENT OUTPUT:\n"
            + compact_email
            + "\n\nMARKET RESEARCH AGENT OUTPUT:\n"
            + compact_market_research
            + "\n\nIMPORTANT CAMPAIGN ANALYST INSTRUCTION:\n"
            + "Analyze only information actually provided. "
              "Do not invent campaign performance metrics. "
              "If actual performance data is unavailable, "
              "clearly state 'Data Not Provided'. "
              "Separate facts, assumptions, recommendations, "
              "and suggested targets."
        )

        campaign_analyst_agent = CampaignAnalystAgent()

        campaign_analyst = self._run_full_agent(
            campaign_analyst_agent,
            task,
            analyst_context,
            max_tokens=350
        )

        # ---------------------------------------------------------
        # 6. FINAL INTEGRATED CAMPAIGN PLAN
        # ---------------------------------------------------------
        #
        # IMPORTANT:
        #
        # There is NO additional Groq call here.
        #
        # The complete outputs from all 8 agents are preserved
        # directly.
        #
        # ---------------------------------------------------------

        final = f"""
# INTEGRATED MARKETING CAMPAIGN PLAN

## Campaign Task

{task}

## MCP Campaign Brief

### Product

{product}

### Target Audience

{audience}

### Campaign Details

{campaign_brief}

## MCP Hashtag Suggestions

{hashtag_result}

---

# 1. MARKETING STRATEGY

{strategy}

---

# 2. MARKETING CONTENT

{content}

---

# 3. SOCIAL MEDIA MARKETING

{social_media}

---

# 4. SEO

{seo}

---

# 5. PAID SEARCH SUPPORT

{ads}

---

# 6. EMAIL MARKETING

{email}

---

# 7. MARKET RESEARCH

{market_research}

---

# 8. CAMPAIGN ANALYSIS

{campaign_analyst}

---

# 9. CAMPAIGN EXECUTION SUMMARY

The campaign should use the specialized AI employee
deliverables above as one coordinated marketing workflow.

The Marketing Strategy section provides the overall
campaign direction.

The Content section provides practical content ideas,
creative direction, captions, hooks, calls-to-action,
and content calendar guidance.

The Social Media section provides platform-specific
social media content and engagement recommendations.

The SEO section provides keyword research, search intent,
content optimization, and SEO recommendations.

The Paid Search section provides SEO-adjacent paid-search
support, keyword opportunities, ad messaging suggestions,
negative keyword ideas, and optimization guidance.

The Email section provides the email campaign sequence,
subject lines, preview text, email copy, follow-ups,
and promotional variations.

The Market Research section provides customer, audience,
competitor, market opportunity, and research insights.

The Campaign Analyst section identifies available
performance information, data gaps, optimization
recommendations, and testing opportunities.

All deliverables remain aligned with the CURRENT TASK.

Product:

{product}

Target Audience:

{audience}

Campaign Objective:

{brief.get("goal") or "Create an effective marketing campaign"}

The campaign should use the above deliverables consistently
without changing the product, audience, or campaign objective.

---

# 10. IMPLEMENTATION CHECKLIST

- Use the approved campaign positioning.
- Use the defined audience segments.
- Use the recommended content formats.
- Use the recommended social media formats.
- Apply the recommended SEO keyword direction.
- Use paid-search recommendations where relevant.
- Use the provided hooks and calls-to-action.
- Execute the email sequence using suggested relative timing.
- Use MCP-generated hashtag suggestions where relevant.
- Apply market research insights to campaign messaging.
- Track the recommended campaign KPIs.
- Review campaign performance using actual available data.
- Optimize future campaign activities based on evidence.
- Keep all messaging consistent with the current campaign.
"""

        # ---------------------------------------------------------
        # 7. RETURN COMPLETE MULTI-AGENT RESULT
        # ---------------------------------------------------------

        return {
            "strategy": strategy,
            "content": content,
            "social_media": social_media,
            "seo": seo,
            "ads": ads,
            "email": email,
            "market_research": market_research,
            "campaign_analyst": campaign_analyst,
            "mcp_campaign_brief": campaign_brief,
            "mcp_hashtags": hashtag_result,
            "final": final
        }