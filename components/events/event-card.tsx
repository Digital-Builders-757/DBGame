import Link from "next/link";
import type { EventListItem } from "@/components/events/types";

function formatDate(iso?: string | null) {
  if (!iso) return "TBA";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default function EventCard({ event }: { event: EventListItem }) {
  const when = formatDate(event.start_at);

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-5 hover-lift transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-heading font-semibold text-brand-text-primary">
            {event.title}
          </h2>
          {event.subtitle ? (
            <p className="mt-1 text-sm text-brand-text-secondary">{event.subtitle}</p>
          ) : null}

          <div className="mt-3 space-y-1 text-sm text-brand-text-secondary">
            <div className="font-medium">{when}</div>
            <div>
              {event.venue_name ? event.venue_name : "Venue TBA"}
              {event.city ? ` • ${event.city}` : ""}
            </div>
            {typeof event.capacity === "number" ? (
              <div className="opacity-80">Capacity: {event.capacity}</div>
            ) : null}
          </div>
        </div>

        {event.slug ? (
          <Link
            href={`/events/${event.slug}`}
            className="btn-brand-primary px-6 py-2 rounded-xl text-sm font-medium neon-shadow-magenta whitespace-nowrap"
          >
            RSVP
          </Link>
        ) : (
          <button
            disabled
            className="px-6 py-2 rounded-xl text-sm font-medium border border-brand-border bg-brand-card/50 opacity-50 cursor-not-allowed whitespace-nowrap"
          >
            RSVP
          </button>
        )}
      </div>
    </div>
  );
}
