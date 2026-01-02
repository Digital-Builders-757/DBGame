"use client";

import EventCard from "@/components/events/event-card";
import type { EventListItem } from "@/components/events/types";

export default function EventsListClient({ events }: { events: EventListItem[] }) {
  if (!events?.length) {
    return (
      <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-6">
        <p className="text-sm text-brand-text-secondary">
          No upcoming events right now. Check back soon for new events!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
