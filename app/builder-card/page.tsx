"use client";

import Link from "next/link";

export default function BuilderCardPage() {
  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/15 via-brand-light-blue/12 to-brand-gray/12 opacity-90" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
            Event Pass
          </span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-blue">
            Event Pass
          </h1>
          <p className="text-lg sm:text-xl text-brand-text-secondary max-w-3xl">
            Soon you&apos;ll see your attendance history and last event attended here. This page will read from the `event_pass_view` and reflect your real check-ins.
          </p>
        </div>
        <div className="grid gap-4 text-brand-text-secondary">
          <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-4">
            <p className="text-sm uppercase tracking-[0.15em] text-brand-blue font-semibold">Planned</p>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>Events attended count</li>
              <li>Region and handle from profile</li>
              <li>Last event attended (based on checked-in tickets)</li>
              <li>User identity information</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link href="/events" className="w-full sm:w-auto">
            <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-gray">
              View Events
            </button>
          </Link>
          <Link href="/create-account" className="w-full sm:w-auto">
            <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-blue">
              Create ViBE Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

