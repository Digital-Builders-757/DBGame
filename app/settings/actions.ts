"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

function assertUserId(user: { id?: string }): asserts user is { id: string } {
  if (!user.id) throw new Error("Missing user id");
}

export async function updateBasicProfile(formData: FormData) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error: sessionErr,
  } = await supabase.auth.getUser();

  if (sessionErr || !user) {
    return { error: "Not authenticated" };
  }

  assertUserId(user);
  const display_name = String(formData.get("display_name") ?? "").trim();

  const patch = { display_name };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update(patch as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .eq("id", user.id as string)
    .select("id,display_name,avatar_url,avatar_path,email_verified,created_at,updated_at")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function updateEmail(newEmail: string) {
  "use server";
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) {
    return { error: error.message };
  }

  return { success: true }; // Supabase will send a confirmation email
}

export async function changePassword(password: string) {
  "use server";
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.auth.updateUser({ password });
  return error ? { error: error.message } : { success: true };
}

// TOTL-specific profile functions removed - Digital Builders uses simplified profile structure
// These functions referenced talent_profiles and client_profiles tables which don't exist in Digital Builders

export async function uploadAvatar(formData: FormData) {
  "use server";

  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Authentication failed" };
    }

    assertUserId(user);

    const file = formData.get("avatar") as File | null;
    if (!file || file.size === 0) {
      return { error: "No file provided" };
    }

    // Enhanced file validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Invalid file type. Please use JPEG, PNG, GIF, or WebP" };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB` };
    }

    // Generate optimized path following user-specific folder pattern
    const ext =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "gif";
    const timestamp = Date.now();
    const path = `${user.id}/avatar-${timestamp}.${ext}`;

    // Upload new file first
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return { error: "Failed to upload image. Please try again." };
    }

    // Update database with new path
    const patch = {
      avatar_path: path,
      updated_at: new Date().toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from("profiles")
      .update(patch as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .eq("id", user.id as string)
      .select("id,display_name,avatar_url,avatar_path,email_verified,created_at,updated_at")
      .single();

    if (updateError) {
      // Rollback: remove the uploaded file
      await supabase.storage.from("avatars").remove([path]);
      console.error("Database update error:", updateError);
      return { error: "Failed to update profile. Please try again." };
    }

    // Clean up old avatars after successful update
    try {
      const { data: list } = await supabase.storage.from("avatars").list(user.id);
      if (list && list.length > 1) {
        const filesToDelete = list.map((f: { name: string }) => `${user.id}/${f.name}`).filter((p: string) => p !== path); // Keep only the new file

        if (filesToDelete.length > 0) {
          await supabase.storage.from("avatars").remove(filesToDelete);
        }
      }
    } catch (cleanupError) {
      // Log but don't fail the operation for cleanup errors
      console.warn("Avatar cleanup warning:", cleanupError);
    }

    revalidatePath("/settings");
    return {
      success: true,
      avatarPath: path,
      message: "Avatar updated successfully",
    };
  } catch (error) {
    console.error("Unexpected avatar upload error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
