"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

/**
 * Ensures a user profile exists and has proper display_name
 * Called after login to guarantee profile is set up correctly
 */
export async function ensureProfileExists() {
  const supabase = await createSupabaseServer();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if profile exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error: profileError } = await (supabase as any)
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    // Error other than "not found"
    console.error("Error checking profile:", profileError);
    return { error: profileError.message };
  }

  // Get display name from user metadata or email
  const displayName =
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  // Create or update profile
  if (!profile) {
    // Profile doesn't exist - create it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any).from("profiles").insert({
      id: user.id,
      display_name: displayName,
      email: user.email || "",
      role: user.user_metadata?.role || null,
    });

    if (insertError) {
      console.error("Error creating profile:", insertError);
      return { error: insertError.message };
    }
  } else if (!profile.display_name) {
    // Profile exists but missing display_name - update it
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

  return { success: true };
}

/**
 * Handles login redirect based on user role
 * Ensures profile exists before redirecting
 */
export async function handleLoginRedirect(returnUrl?: string) {
  const supabase = await createSupabaseServer();
  
  // Ensure profile exists first
  const profileResult = await ensureProfileExists();
  if (profileResult.error) {
    console.error("Failed to ensure profile exists:", profileResult.error);
    // Continue anyway - redirect will handle missing profile
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
    return;
  }

  // Get user role from profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If returnUrl is provided and valid, use it
  if (returnUrl && returnUrl.startsWith("/")) {
    redirect(returnUrl);
    return;
  }

  // Redirect based on role
  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    // For Digital Builders, redirect to dashboard (no talent/client split)
    redirect("/dashboard");
  }
}

