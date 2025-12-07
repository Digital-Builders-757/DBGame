"use client";

import { Sparkles, Users, Shield, CalendarClock, Bolt } from "lucide-react";
import Link from "next/link";
import { FloatingPathsBackground } from "@/components/ui/floating-paths-background";

const stats = [
  { label: "Upcoming Events", value: "12", accent: "magenta" },
  { label: "Builders Checked In", value: "4,200+", accent: "green" },
  { label: "XP Logged", value: "1.2M", accent: "cyan" },
  { label: "Cities Activated", value: "7", accent: "magenta" },
];

const featureCards = [
  {
    title: "Real Opportunities",
    copy: "Workshops, hack nights, demo days, and partner-led challenges that turn into career momentum.",
    icon: Sparkles,
    accent: "magenta",
  },
  {
    title: "Real Parties",
    copy: "High-energy meetups, live DJs, and builder-only socials. Show up, get checked in, level up.",
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
    title: "Account = Access",
    copy: "You must have a Builder Account to attend events. Your ID, your XP, your invite to the next room.",
    icon: Shield,
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
              <Bolt className="h-4 w-4 text-brand-magenta" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                Digital Builders World
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight neon-glow-magenta">
              You Must Have A Builder Account In Order To Attend Events!
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-brand-text-secondary">
              Inside every event: real opportunities, real parties, real vibes for the builders of the world.
              RSVP, check in, and walk away with XP and badges on your Builder Card.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
                  Create Builder Account
                </button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-green">
                  View Upcoming Events
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-4 sm:p-5 hover-lift hover-glow transition-all"
                >
                  <div
                    className={`text-2xl sm:text-3xl font-bold font-heading ${
                      stat.accent === "magenta"
                        ? "text-brand-magenta"
                        : stat.accent === "green"
                        ? "text-brand-green"
                        : "text-brand-cyan"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-sm text-brand-text-secondary mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative w-full px-4 sm:px-6 lg:px-10 pb-20 lg:pb-28">
        <div className="mx-auto w-full max-w-none">
          <div className="text-center mb-12 space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-text-secondary">Why Builders Show Up</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading">
              Real events. Real XP. Real community.
            </h2>
            <p className="text-brand-text-secondary max-w-3xl mx-auto">
              Every door you walk through counts toward your Builder Card. Get in the room, get checked in,
              and get rewarded.
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
            <p className="text-sm uppercase tracking-[0.3em] text-brand-text-secondary">One Rule</p>
            <h3 className="text-3xl sm:text-4xl font-heading font-bold neon-glow-magenta">
              You must have a Builder Account to attend events.
            </h3>
            <p className="text-brand-text-secondary max-w-3xl mx-auto">
              That’s how we keep the rooms high-signal and the energy right. Claim your account, RSVP, and we’ll see you inside.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-2">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
                  Claim Your Account
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
      </section>
    </div>
  );
}

