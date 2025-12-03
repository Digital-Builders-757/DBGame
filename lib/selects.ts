/**
 * Canonical column selection helpers for Supabase queries
 * Use these to ensure consistent column selection across the app
 *
 * This file will be updated as Digital Builders schema is created.
 * Currently empty - add your game-specific selects here.
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

// Digital Builders specific selects (to be added)
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
