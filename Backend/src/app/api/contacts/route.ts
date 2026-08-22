import { NextResponse } from "next/server";
import { requireRole, toErrorResponse } from "@/lib/auth/account";

export async function GET() {
  try {
    const { supabase, accountId } = await requireRole("agent");

    const { data, error } = await supabase
      .from("contacts")
      .select(`
        id,
        user_id,
        account_id,
        phone,
        phone_normalized,
        name,
        email,
        company,
        avatar_url,
        created_at,
        updated_at,
        contact_tags (
          tags (
            id,
            name,
            color
          )
        )
      `)
      .eq("account_id", accountId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch contacts:", error);

      return NextResponse.json(
        { error: "Failed to fetch contacts" },
        { status: 500 }
      );
    }

    const contacts = (data ?? []).map((contact: any) => ({
      id: contact.id,
      user_id: contact.user_id,
      account_id: contact.account_id,
      phone: contact.phone,
      phone_normalized: contact.phone_normalized ?? null,
      name: contact.name ?? "",
      email: contact.email ?? "",
      company: contact.company ?? "",
      avatar_url: contact.avatar_url ?? null,
      tags: (contact.contact_tags ?? [])
        .map((item: any) => item.tags)
        .filter(Boolean),
      created_at: contact.created_at,
      updated_at: contact.updated_at,
    }));

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Contacts GET error:", error);
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, accountId, userId } =
      await requireRole("agent");

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    const company =
      typeof body.company === "string"
        ? body.company.trim()
        : "";

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const { data: existing, error: existingError } =
      await supabase
        .from("contacts")
        .select("id")
        .eq("account_id", accountId)
        .eq("phone", phone)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Failed to check existing contact:",
        existingError
      );

      return NextResponse.json(
        { error: "Failed to check existing contact" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        {
          error:
            "A contact with this phone number already exists",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("contacts")
      .insert({
        account_id: accountId,
        user_id: userId,
        phone,
        name: name || phone,
        email: email || null,
        company: company || null,
      })
      .select(`
        id,
        user_id,
        account_id,
        phone,
        phone_normalized,
        name,
        email,
        company,
        avatar_url,
        created_at,
        updated_at
      `)
      .single();

    if (error) {
      console.error("Failed to create contact:", error);

      return NextResponse.json(
        { error: "Failed to create contact" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Contacts POST error:", error);
    return toErrorResponse(error);
  }
}