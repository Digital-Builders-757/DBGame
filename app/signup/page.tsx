"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/15 via-brand-cyan/12 to-brand-green/12 opacity-90" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
            Digital Builders World
          </span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold leading-tight neon-glow-magenta">
            Create Your Builder Account
          </h1>
          <p className="text-lg sm:text-xl text-brand-text-secondary">
            We&apos;re finalizing the signup flow. For now, start from the Create Account page to claim your Builder Account and then continue to events.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link href="/create-account" className="w-full sm:w-auto">
            <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-magenta">
              Go to Create Account
            </button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-green">
              Already a Builder? Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

