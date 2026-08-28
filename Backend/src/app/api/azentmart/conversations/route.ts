import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/flows/admin-client";
import {
  CONVERSATION_SELECT,
  normalizeConversations,
} from "@/lib/inbox/conversations";

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("conversations")
      .select(CONVERSATION_SELECT)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch conversations:", error);

      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    const conversations = normalizeConversations(data ?? []);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Azentmart conversations error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}