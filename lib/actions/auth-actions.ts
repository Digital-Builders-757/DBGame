"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

function deriveDisplayName(email?: string | null) {
  return email?.split("@")[0] || "User";
}

/**
 * Ensures a user profile exists and has a display_name.
 * Defaults role to 'user' when creating a new profile.
 */
export async function ensureProfileExists() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Use maybeSingle so missing rows return null, not an exception.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error: profileError } = await (supabase as any)
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error checking profile:", profileError);
    return { error: profileError.message };
  }

  const displayName =
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    deriveDisplayName(user.email);

  if (!profile) {
    // Create profile with user default (migration complete, no 'builder' role)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any).from("profiles").insert({
      id: user.id,
      display_name: displayName,
      role: "user",
    });

    if (insertError) {
      console.error("Error creating profile:", insertError);
      return { error: insertError.message };
    }

    return { success: true };
  }

  // Update display_name if missing
  if (!profile.display_name || String(profile.display_name).trim() === "") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { error: updateError.message };
    }
  }

  // If role is null/empty for some reason, set to user (optional safety)
  if (!profile.role) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("profiles")
      .update({ role: "user" })
      .eq("id", user.id);
  }

  return { success: true };
}

/**
 * After login, ensure profile exists then redirect.
 */
export async function handleLoginRedirect(returnUrl?: string) {
  await ensureProfileExists();

  // If returnUrl is provided and valid, use it
  if (returnUrl && returnUrl.startsWith("/")) {
    redirect(returnUrl);
  }

  redirect("/events");
}
