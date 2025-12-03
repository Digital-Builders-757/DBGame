// Digital Builders - Types simplified until schema is created

/**
 * Safe query wrapper for Supabase operations
 * Provides consistent error handling and logging
 *
 * This file will be updated as Digital Builders schema is created.
 */

export async function safe<T>(promise: Promise<{ data: T; error: unknown }>): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    console.error("Supabase query error:", error);
    throw error;
  }
  return data;
}

/**
 * Safe query wrapper that returns null instead of throwing
 * Useful for optional data fetching
 */
export async function safeOptional<T>(
  promise: Promise<{ data: T; error: unknown }>
): Promise<T | null> {
  try {
    return await safe(promise);
  } catch (error) {
    console.warn("Optional query failed:", error);
    return null;
  }
}

/**
 * Safe insert wrapper with proper typing
 */
export async function safeInsert<T>(
  promise: Promise<{ data: T | null; error: unknown }>
): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  if (!data) {
    throw new Error("Insert returned no data");
  }
  return data;
}

/**
 * Safe update wrapper
 */
export async function safeUpdate<T>(
  promise: Promise<{ data: T | null; error: unknown }>
): Promise<T | null> {
  const { data, error } = await promise;
  if (error) {
    console.error("Supabase update error:", error);
    throw error;
  }
  return data;
}

/**
 * A utility to create safe Supabase queries
 * Add Digital Builders specific queries here as schema is created
 */
export const safeQuery = {
  /**
   * Safely get a profile by user ID
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getProfileByUserId: async (supabase: any, userId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (supabase as any)
      .from("profiles")
      .select("id, display_name, role, email_verified, created_at")
      .eq("id", userId)
      .maybeSingle();
  },

  // Digital Builders specific queries (to be added)
  // Example:
  // getCharacterByUserId: async (supabase: SupabaseClient<Database>, userId: string) => {
  //   return await supabase
  //     .from("characters")
  //     .select("id, user_id, handle, career_track, district_id")
  //     .eq("user_id", userId)
  //     .maybeSingle();
  // },
};
