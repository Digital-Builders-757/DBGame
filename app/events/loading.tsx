import { EventsPageShell } from "@/components/events/events-page-shell";

export default function Loading() {
  return (
    <EventsPageShell>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
        <div className="h-4 w-40 rounded bg-brand-card/50 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-10 w-64 rounded bg-brand-card/50 animate-pulse" />
        <div className="h-6 w-96 rounded bg-brand-card/50 animate-pulse" />
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-brand-border bg-brand-card/50 animate-pulse"
          />
        ))}
      </div>
    </EventsPageShell>
  );
}
