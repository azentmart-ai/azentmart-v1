import { NextResponse } from "next/server";
import { requireRole, toErrorResponse } from "@/lib/auth/account";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/contacts/:id
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { supabase, accountId } = await requireRole("agent");
    const { id } = await params;

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
      .eq("id", id)
      .eq("account_id", accountId)
      .single();

    if (error) {
      console.error("Failed to fetch contact:", error);

      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    const contact = {
      id: data.id,
      user_id: data.user_id,
      account_id: data.account_id,
      phone: data.phone,
      phone_normalized: data.phone_normalized ?? null,
      name: data.name ?? "",
      email: data.email ?? "",
      company: data.company ?? "",
      avatar_url: data.avatar_url ?? null,
      tags: ((data as any).contact_tags ?? [])
        .map((item: any) => item.tags)
        .filter(Boolean),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Contact GET error:", error);
    return toErrorResponse(error);
  }
}

// PATCH /api/contacts/:id
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { supabase, accountId } = await requireRole("agent");
    const { id } = await params;

    const body = await request.json();

    const updateData: Record<string, any> = {};

    if (typeof body.name === "string") {
      updateData.name = body.name.trim();
    }

    if (typeof body.phone === "string") {
      updateData.phone = body.phone.trim();
    }

    if (typeof body.email === "string") {
      updateData.email = body.email.trim() || null;
    }

    if (typeof body.company === "string") {
      updateData.company = body.company.trim() || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    if (updateData.phone === "") {
      return NextResponse.json(
        { error: "Phone number cannot be empty" },
        { status: 400 }
      );
    }

    // Make sure the contact belongs to this account
    const { data: existing, error: existingError } =
      await supabase
        .from("contacts")
        .select("id")
        .eq("id", id)
        .eq("account_id", accountId)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Failed to find contact:",
        existingError
      );

      return NextResponse.json(
        { error: "Failed to find contact" },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // If phone is being changed, prevent duplicates
    if (updateData.phone) {
      const { data: duplicate, error: duplicateError } =
        await supabase
          .from("contacts")
          .select("id")
          .eq("account_id", accountId)
          .eq("phone", updateData.phone)
          .neq("id", id)
          .maybeSingle();

      if (duplicateError) {
        console.error(
          "Failed to check duplicate phone:",
          duplicateError
        );

        return NextResponse.json(
          { error: "Failed to check phone number" },
          { status: 500 }
        );
      }

      if (duplicate) {
        return NextResponse.json(
          {
            error:
              "A contact with this phone number already exists",
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", id)
      .eq("account_id", accountId)
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
      console.error("Failed to update contact:", error);

      return NextResponse.json(
        { error: "Failed to update contact" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Contact PATCH error:", error);
    return toErrorResponse(error);
  }
}

// DELETE /api/contacts/:id
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { supabase, accountId } = await requireRole("agent");
    const { id } = await params;

    // Make sure the contact belongs to this account
    const { data: existing, error: existingError } =
      await supabase
        .from("contacts")
        .select("id")
        .eq("id", id)
        .eq("account_id", accountId)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Failed to find contact:",
        existingError
      );

      return NextResponse.json(
        { error: "Failed to find contact" },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id)
      .eq("account_id", accountId);

    if (error) {
      console.error("Failed to delete contact:", error);

      return NextResponse.json(
        { error: "Failed to delete contact" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id,
    });
  } catch (error) {
    console.error("Contact DELETE error:", error);
    return toErrorResponse(error);
  }
}