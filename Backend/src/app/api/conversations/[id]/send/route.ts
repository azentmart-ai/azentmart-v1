import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendInstagramMessage } from "@/lib/instagram";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data: conversation, error: convoError } = await supabase
      .from("instagram_conversations")
      .select("igsid")
      .eq("id", id)
      .single();

    if (convoError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log("Sending Instagram message to:", conversation.igsid);

    await sendInstagramMessage(conversation.igsid, message);

    const { data: msg, error: msgError } = await supabase
      .from("instagram_messages")
      .insert({
        conversation_id: id,
        role: "assistant",
        content: message,
      })
      .select()
      .single();

    if (msgError) {
      console.error("Message insert error:", msgError);

      return NextResponse.json(
        { error: msgError.message },
        { status: 500, headers: corsHeaders }
      );
    }

    const { error: updateError } = await supabase
      .from("instagram_conversations")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Conversation update error:", updateError);
    }

    return NextResponse.json(msg, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Send message error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}