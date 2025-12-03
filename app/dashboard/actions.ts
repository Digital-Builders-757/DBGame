"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServer();

  // Get the current session to verify the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const displayName = formData.get("display_name") as string;

  // Update the profile using the user's ID from the session
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { error: error.message };
  }

  // Revalidate the dashboard path to refresh the data
  revalidatePath("/dashboard");

  return { success: true };
}

// Digital Builders - No talent profiles needed, all data in profiles table
