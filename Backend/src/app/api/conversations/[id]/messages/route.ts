import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("Loading messages for conversation:", id);

  const { data: messages, error } = await supabase
    .from("instagram_messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase message error:", error);

    return Response.json(
      { error: error.message },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  console.log(
    `Loaded ${messages?.length || 0} messages for conversation ${id}`
  );

  return Response.json(messages || [], {
    status: 200,
    headers: corsHeaders,
  });
}