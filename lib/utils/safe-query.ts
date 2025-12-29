// Digital Builders - Types simplified until schema is created
// Legacy TOTL-specific types removed - now using Digital Builders schema

/**
 * Safe query wrapper for Supabase operations
 * Provides consistent error handling and logging
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
 * Digital Builders specific queries will be added as schema is created
 */
export const safeQuery = {
  /**
   * Safely get a profile by user ID
   * Uses maybeSingle() to prevent 406 errors when profile doesn't exist
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
  // getCharacterByUserId: async (supabase: any, userId: string) => {
  //   return await (supabase as any)
  //     .from("characters")
  //     .select("id, user_id, handle, career_track, district_id")
  //     .eq("user_id", userId)
  //     .maybeSingle();
  // },
};
