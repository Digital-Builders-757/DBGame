import type { Database } from "@/types/supabase";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

/**
 * Shared type for event list items.
 * Used consistently across server and client components to prevent type drift.
 */
export type EventListItem = Pick<
  EventRow,
  | "id"
  | "slug"
  | "title"
  | "subtitle"
  | "venue_name"
  | "city"
  | "start_at"
  | "end_at"
  | "capacity"
>;
