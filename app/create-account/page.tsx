"use client";

import { ArrowLeft, Sparkles, Shield, Users } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";

export const dynamic = "force-dynamic";

export default function CreateAccountPage() {
  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/15 via-brand-cyan/12 to-brand-green/12 opacity-90" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-32 -top-24 w-80 h-80 bg-brand-magenta/20 blur-3xl" />
        <div className="absolute right-10 top-10 w-72 h-72 bg-brand-cyan/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 w-96 h-96 bg-brand-green/16 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <div className="font-mono text-xl font-bold">
            <span className="text-brand-green">{"{"}</span>
            <span className="text-brand-cyan">bl</span>
            <span className="text-brand-green">{"}"}</span>
            <span className="text-brand-magenta">;</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
              <Sparkles className="h-4 w-4 text-brand-magenta" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                Digital Builders World
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-magenta">
                Create Your Builder Account
              </h1>
              <p className="text-lg sm:text-xl text-brand-text-secondary max-w-2xl">
                One rule: you need a Builder Account to attend events. Claim yours now to RSVP, check in at the door,
                and stack XP on your Builder Card.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
                  Start Your Account
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-green">
                  Already a Builder? Sign In
                </button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Feature title="Real Access" copy="Unlock events, check-ins, and XP on your Builder Card." icon={<Shield className="h-5 w-5" />} />
              <Feature title="Real Community" copy="Join builders who ship, mentor, and collab." icon={<Users className="h-5 w-5" />} />
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-brand-magenta/20 via-brand-cyan/12 to-brand-green/16 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-brand-border bg-brand-card/70 backdrop-blur shadow-2xl shadow-brand-magenta/20">
              <SafeImage
                src="/images/builder-team-hero.jpg"
                alt="Digital Builders collaborating"
                width={1200}
                height={900}
                className="w-full h-full object-cover"
                fallbackSrc="/images/solo_logo.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-background/80 via-brand-background/20 to-transparent" />
              <div className="absolute left-6 bottom-6 space-y-1">
                <p className="text-sm uppercase tracking-[0.25em] text-brand-text-secondary">Builders in the field</p>
                <p className="text-xl font-heading font-bold text-brand-text-primary">Build. Check In. Level Up.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, copy, icon }: { title: string; copy: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-4 space-y-2 hover-lift hover-glow transition-all">
      <div className="flex items-center gap-2 text-brand-magenta font-heading font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm text-brand-text-secondary">{copy}</p>
    </div>
  );
}

