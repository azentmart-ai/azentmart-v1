import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/flows/admin-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ============================================================
    // 1. CHECK CONVERSATION ID
    // ============================================================

    if (!id) {
      return NextResponse.json(
        {
          error: "Conversation ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = supabaseAdmin();

    // ============================================================
    // 2. CHECK THAT CONVERSATION EXISTS
    // ============================================================

    const { data: conversation, error: conversationError } =
      await supabase
        .from("conversations")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (conversationError) {
      console.error(
        "Failed to find conversation:",
        conversationError
      );

      return NextResponse.json(
        {
          error: "Failed to find conversation",
        },
        {
          status: 500,
        }
      );
    }

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    // ============================================================
    // 3. FETCH ALL MESSAGES FOR THIS CONVERSATION
    // ============================================================

    const { data: messages, error: messagesError } =
      await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", {
          ascending: true,
        })
        .order("id", {
          ascending: true,
        });

    if (messagesError) {
      console.error(
        "Failed to fetch conversation messages:",
        messagesError
      );

      return NextResponse.json(
        {
          error: "Failed to fetch conversation messages",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // 4. RETURN COMPLETE CHAT HISTORY
    // ============================================================

    return NextResponse.json(
      messages ?? [],
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Azentmart conversation messages error:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}