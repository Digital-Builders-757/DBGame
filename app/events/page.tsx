"use client";

import Link from "next/link";

export default function EventsPage() {
  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/12 via-brand-cyan/10 to-brand-green/10 opacity-90" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
            Digital Builders Events
          </span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-magenta">
            Events are coming online
          </h1>
          <p className="text-lg sm:text-xl text-brand-text-secondary max-w-3xl">
            We&apos;re wiring up the full event list, detail pages, and RSVP flow. You&apos;ll be able to see upcoming events, claim tickets, and check in with your Builder Account.
          </p>
        </div>
        <div className="grid gap-4 text-brand-text-secondary">
          <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-4">
            <p className="text-sm uppercase tracking-[0.15em] text-brand-magenta font-semibold">Next steps</p>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>List upcoming events with RSVP buttons</li>
              <li>Event details with RSVP / Cancel RSVP states</li>
              <li>Admin-only event creation + capacity</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link href="/create-account" className="w-full sm:w-auto">
            <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
              Create Builder Account
            </button>
          </Link>
          <Link href="/builder-card" className="w-full sm:w-auto">
            <button className="btn-brand-tertiary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-cyan">
              View Builder Card
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

