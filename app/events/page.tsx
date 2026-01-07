import EventsListClient from "@/components/events/events-list-client";
import { EventsPageShell } from "@/components/events/events-page-shell";
import type { EventListItem } from "@/components/events/types";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";


// Select columns needed for filtering + display
// Note: status and is_public are used for filtering but not passed to client
const COLUMNS =
  "id,slug,title,subtitle,venue_name,city,start_at,end_at,capacity,status,is_public";

export default async function EventsPage() {
  const supabase = await createSupabaseServer();

  try {
    // TODO: Timezone handling - This uses server runtime timezone for "upcoming" filter.
    // For MVP this is acceptable, but consider:
    // - Using Postgres `now()` in a view/RPC for more accurate timezone handling
    // - Ensuring all event times are stored as UTC timestamptz consistently
    // - Handling DST transitions if events span timezone boundaries
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .select(COLUMNS)
      .eq("is_public", true)
      .eq("status", "published")
      .gte("start_at", nowIso)
      .order("start_at", { ascending: true });

    if (error) {
      return (
        <EventsPageShell>
          <div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-magenta">
              Events
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-brand-text-secondary">
              We couldn&apos;t load events right now. Please try again in a moment.
            </p>
          </div>
        </EventsPageShell>
      );
    }

    // Cast to EventListItem[] - only include fields that match the type
    // (status and is_public are filtered but not passed to client)
    const events = (data ?? []).map(
      ({ id, slug, title, subtitle, venue_name, city, start_at, end_at, capacity }) => ({
        id,
        slug,
        title,
        subtitle,
        venue_name,
        city,
        start_at,
        end_at,
        capacity,
      })
    ) as EventListItem[];

    return (
      <EventsPageShell>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
            Digital Builders Events
          </span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-magenta">
            Upcoming Events
          </h1>
          <p className="text-lg sm:text-xl text-brand-text-secondary max-w-3xl">
            RSVP to lock your seat at the next Digital Builders event.
          </p>
        </div>

        <EventsListClient events={events} />
      </EventsPageShell>
    );
  } catch {
    return (
      <EventsPageShell>
        <div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-magenta">
            Events
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-brand-text-secondary">
            Something went wrong loading events.
          </p>
        </div>
      </EventsPageShell>
    );
  }
}
