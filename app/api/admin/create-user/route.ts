import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin-client";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role,
      },
    });

    if (authError) {
      // If user already exists, that's fine for testing - user was created via UI
      // Just return success (the user exists and can be used for login)
      if (authError.message.includes("already been registered") || authError.code === "email_exists") {
        return NextResponse.json(
          { success: true, message: "User already exists" },
          { status: 200 }
        );
      }
      
      console.error("Auth user creation failed:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Step 2: Create profile record (profiles table only has display_name, not first_name/last_name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase as any).from("profiles").insert([
      {
        id: authData.user.id,
        display_name: `${firstName} ${lastName}`,
        role,
        email_verified: true,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      console.error("Profile creation failed:", profileError);
      // Continue anyway since the auth user was created
    }

    // Step 3: Digital Builders - No role-specific profiles needed
    // All user data is stored in the profiles table

    return NextResponse.json({ success: true, user: authData.user }, { status: 200 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
