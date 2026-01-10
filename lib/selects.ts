/**
 * Canonical column selection helpers for Supabase queries
 * Use these to ensure consistent column selection across the app
 *
 * ViBE platform column selections
 */

// Core table selections
export const selectProfile = [
  "id",
  "role",
  "display_name",
  "avatar_url",
  "email_verified",
  "created_at",
  "updated_at",
].join(",");

// ViBE specific selects
// Example:
// export const selectCharacter = [
//   "id",
//   "user_id",
//   "handle",
//   "career_track",
//   "district_id",
//   "created_at",
// ].join(",");

// export const selectGameAccount = [
//   "id",
//   "user_id",
//   "created_at",
// ].join(",");
