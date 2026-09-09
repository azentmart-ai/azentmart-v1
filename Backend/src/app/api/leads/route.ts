import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase credentials missing" },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabase
      .from("instagram_conversations")
      .select(
        `
        id,
        igsid,
        username,
        name,
        profile_pic,
        follower_count,
        is_user_follow_business,
        is_business_follow_user,
        created_at,
        updated_at
        `
      )
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error("Leads query error:", error.message);

      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : String(err);

    console.error("Error in /api/leads:", errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}