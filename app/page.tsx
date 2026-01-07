"use client";

import { Sparkles, Users, MapPin, CalendarClock, Award } from "lucide-react";
import Link from "next/link";
import { FloatingPathsBackground } from "@/components/ui/floating-paths-background";

const featureCards = [
  {
    title: "Real Opportunities",
    copy: "Workshops, hack nights, demo days, and partner-led challenges that turn into career momentum.",
    icon: Sparkles,
    accent: "magenta",
  },
  {
    title: "Real Parties",
    copy: "High-energy meetups, live DJs, and builder-only socials. Show up, connect, and build together.",
    icon: CalendarClock,
    accent: "cyan",
  },
  {
    title: "Real Vibes",
    copy: "A crew of builders who ship. Mentors who help. Teams looking for the next standout.",
    icon: Users,
    accent: "green",
  },
  {
    title: "Your Builder Card",
    copy: "Track your journey through Digital Builders. Every event you attend builds your reputation and unlocks access to future workshops and invites.",
    icon: Award,
    accent: "magenta",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <FloatingPathsBackground opacity={0.08} color="#ff00ff" />

      {/* Hero */}
      <section className="relative w-full px-4 sm:px-6 lg:px-10 pt-20 pb-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/10 via-brand-cyan/10 to-brand-green/10 pointer-events-none" />
        <div className="mx-auto relative z-10 w-full max-w-none">
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
              <MapPin className="h-4 w-4 text-brand-magenta" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                Hampton Roads • 757
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight neon-glow-magenta">
              The Best Tech & Creative Events in the 757
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-brand-text-secondary">
              Workshops. Meetups. Parties. Real people building real things.
              Digital Builders is where Hampton Roads comes to connect, learn, and show out.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link href="/events" className="w-full sm:w-auto">
                <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
                  See Upcoming Events
                </button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-green">
                  Join the Builders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative w-full px-4 sm:px-6 lg:px-10 pt-16 lg:pt-24 pb-20">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-3xl border border-brand-border bg-gradient-to-r from-brand-magenta/10 via-brand-cyan/5 to-brand-green/10 p-8 sm:p-12 text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-text-secondary">Why Digital Builders Exists</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              We&apos;re Building the 757 We Want to Live In
            </h2>
            <p className="text-brand-text-secondary max-w-3xl mx-auto text-lg leading-relaxed">
              Everyone says you have to leave Hampton Roads to find real tech culture.
              We don&apos;t believe that.
            </p>
            <p className="text-brand-text-secondary max-w-3xl mx-auto leading-relaxed">
              Digital Builders is about turning the 757 into a place where builders actually want to show up — not just for work, but for community, collaboration, and fun.
            </p>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative w-full px-4 sm:px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="mx-auto w-full max-w-none">
          <div className="text-center mb-12 space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-text-secondary">Why Builders Show Up</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading">
              Real events. Real community. Real momentum.
            </h2>
            <p className="text-brand-text-secondary max-w-3xl mx-auto">
              Every event is a chance to connect, learn, and build something together.
              Show up. Check in. Be part of what&apos;s next.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              const accentClass =
                feature.accent === "magenta"
                  ? "text-brand-magenta"
                  : feature.accent === "green"
                  ? "text-brand-green"
                  : "text-brand-cyan";
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-6 space-y-4 hover-lift hover-glow transition-all"
                >
                  <div className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${accentClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">{feature.title}</h3>
                  <p className="text-brand-text-secondary leading-relaxed">{feature.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative w-full px-4 sm:px-6 lg:px-10 pb-20">
        <div className="mx-auto w-full max-w-none">
          <div className="rounded-3xl border border-brand-border bg-gradient-to-r from-brand-magenta/15 via-brand-cyan/10 to-brand-green/15 p-8 sm:p-10 text-center space-y-4 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-text-secondary">Ready to Level Up?</p>
            <h3 className="text-3xl sm:text-4xl font-heading font-bold neon-glow-magenta">
              Pull Up to the Next Event
            </h3>
            <p className="text-brand-text-secondary max-w-3xl mx-auto">
              Create your Builder account to RSVP, check in at events, and build your reputation in the Digital Builders community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-2">
              <Link href="/events" className="w-full sm:w-auto">
                <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
                  See Upcoming Events
                </button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-green">
                  Join Digital Builders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
