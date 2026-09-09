import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendInstagramMessage, fetchInstagramProfile } from "@/lib/instagram";
import { getAIResponse } from "@/lib/ai";

// 1. Meta Webhook Verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken =
    process.env.INSTAGRAM_VERIFY_TOKEN || process.env.META_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ Meta Webhook successfully verified!");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// 2. Incoming Messages & Events Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("🔥 INCOMING WEBHOOK PAYLOAD:", JSON.stringify(body, null, 2));

    const entry = body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const changes = entry?.changes?.[0]?.value;

    // Ignore bot's own echo messages
    if (messaging?.message?.is_echo || changes?.message?.is_echo) {
      console.log("⏩ Ignored bot's own echo message");
      return Response.json({ status: "ignored_echo" }, { status: 200 });
    }

    // Safely extract Sender ID
    const senderId =
      messaging?.sender?.id ||
      changes?.sender?.id ||
      changes?.from?.id;

    // Safely extract message text
    const messageText =
      messaging?.message?.text ||
      messaging?.message_edit?.text ||
      changes?.message?.text ||
      changes?.text;

    // Message ID
    const instagramMsgId =
      messaging?.message?.mid ||
      messaging?.message_edit?.mid ||
      changes?.message?.mid ||
      `mid_${Date.now()}`;

    // Skip read receipts / statuses without real text
    if (!messageText || !senderId) {
      console.log("⏩ Ignored event without text or sender ID (e.g. read receipt/status)");
      return Response.json({ status: "ignored_non_text" }, { status: 200 });
    }

    console.log(`📩 Processing message: "${messageText}" from Sender: ${senderId}`);

    const igsid = senderId;
    const text = messageText;

    // 1. Fetch or Create Conversation
    let conversationId: string | null = null;
    try {
      let { data: conversation } = await supabase
        .from("instagram_conversations")
        .select("*")
        .eq("igsid", igsid)
        .maybeSingle();

      if (!conversation) {
        let profile = {};
        try {
          profile = (await fetchInstagramProfile(igsid)) || {};
        } catch {
          // ignore profile fetch error
        }

        const { data: newConvo } = await supabase
          .from("instagram_conversations")
          .insert({
            igsid,
            username: (profile as any)?.username || `user_${igsid.slice(-4)}`,
            name: (profile as any)?.name || "Instagram User",
            mode: "ai",
            ...profile,
          })
          .select()
          .single();

        conversation = newConvo;
      }

      if (conversation) {
        conversationId = conversation.id;

        // Store user incoming message
        await supabase.from("instagram_messages").insert({
          conversation_id: conversation.id,
          role: "user",
          content: text,
          instagram_msg_id: instagramMsgId,
        });

        await supabase
          .from("instagram_conversations")
          .update({ updated_at: new Date().toISOString(), mode: "ai" })
          .eq("id", conversation.id);
      }
    } catch (dbErr) {
      console.error("⚠️ Supabase DB operation warning:", dbErr);
    }

    // 2. Fetch History (with Direct Current Text Fallback)
    let formattedHistory: Array<{ role: "user" | "assistant"; content: string }> = [];

    if (conversationId) {
      const { data: history } = await supabase
        .from("instagram_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(15);

      if (history && history.length > 0) {
        formattedHistory = history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      }
    }

    // Ensure the current text is explicitly in the prompt!
    if (formattedHistory.length === 0 || formattedHistory[formattedHistory.length - 1]?.content !== text) {
      formattedHistory.push({ role: "user", content: text });
    }

    // 3. Generate Dynamic AI Response
    console.log("🤖 Generating AI response with Groq for input:", text);
    const aiResponse = await getAIResponse(formattedHistory);
    console.log("💬 AI Response:", aiResponse);

    // 4. Send back to Instagram
    if (igsid !== "test_user_123" && igsid !== "12334") {
      await sendInstagramMessage(igsid, aiResponse);
      console.log("✅ Message successfully sent to Instagram user:", igsid);
    }

    // 5. Store AI Response in Supabase
    if (conversationId) {
      await supabase.from("instagram_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: aiResponse,
      });
    }

    return Response.json({ status: "replied", reply: aiResponse });
  } catch (error: any) {
    console.error("❌ Webhook error:", error?.message || error);
    return Response.json({ status: "error", details: error?.message }, { status: 500 });
  }
}