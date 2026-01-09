import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-background text-brand-text-primary pt-20">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-90" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-light-blue/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <Badge className="bg-brand-blue/20 text-brand-blue border-brand-blue/30 px-4 py-2 text-sm">
                ✨ About ViBE
              </Badge>
              <h1 className="text-6xl lg:text-8xl font-heading font-bold leading-tight neon-glow-blue">
                Virginia Isn&apos;t
                <span className="text-brand-light-blue"> Boring</span>
              </h1>
              <p className="text-2xl text-brand-text-secondary leading-relaxed max-w-lg">
                Discover what&apos;s happening in Virginia. RSVP to events, check in at the door, and track your attendance with your Event Pass.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-3xl border border-brand-border bg-brand-card/70 backdrop-blur p-8 shadow-2xl shadow-brand-blue/20">
                <div className="aspect-video bg-gradient-to-br from-brand-blue/20 to-brand-light-blue/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-24 h-24 text-brand-blue opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-32 bg-gradient-to-b from-brand-background to-brand-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20">
              <Sparkles className="h-4 w-4 text-brand-blue" />
              <span className="text-brand-text-primary font-medium text-sm">Our Story</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-heading font-bold neon-glow-blue">
              Making Virginia Events Accessible
            </h2>
            
            <div className="space-y-8 text-lg text-brand-text-secondary leading-relaxed text-left">
              <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-8 hover:bg-brand-card/90 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-light-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2026</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-brand-text-primary mb-2">The Vision</h3>
                    <p>
                      ViBE was created to solve a simple problem: finding great events in Virginia shouldn&apos;t be hard. 
                      We&apos;re building the fastest, cleanest way to turn attention into attendance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-8 hover:bg-brand-card/90 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-light-blue to-brand-gray rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Vi</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-brand-text-primary mb-2">Our Mission</h3>
                    <p>
                      ViBE exists to connect people with events. No gamification, no complexity—just discover, RSVP, attend, 
                      and track your Event Pass. If you want to attend events featured on ViBE, you need a ViBE account. That&apos;s it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-8 hover:bg-brand-card/90 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-gray to-brand-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">∞</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-brand-text-primary mb-2">Today & Beyond</h3>
                    <p>
                      Today, ViBE helps people discover tech, creative, and networking events across Virginia. 
                      Our journey continues as we make event discovery simpler and attendance tracking effortless.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-32 bg-brand-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 px-4 py-2 text-sm mb-6">
              🌟 What We Offer
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-heading font-bold neon-glow-blue">How ViBE Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-10 hover:bg-brand-card/90 transition-all group">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-light-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-3 text-brand-text-primary">Event Discovery</h3>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Browse upcoming events across Virginia. Find tech meetups, creative workshops, networking events, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-10 hover:bg-brand-card/90 transition-all group">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-light-blue to-brand-gray rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-3 text-brand-text-primary">Easy RSVP</h3>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Reserve your spot with one click. Cancel anytime. No payment required—just show up and check in.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-10 hover:bg-brand-card/90 transition-all group">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-gray to-brand-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-3 text-brand-text-primary">Check-In System</h3>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Event organizers can check you in at the door. Your attendance is automatically tracked on your Event Pass.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-10 hover:bg-brand-card/90 transition-all group">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-gray rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-3 text-brand-text-primary">Event Pass</h3>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Your Event Pass shows your attendance history, last event attended, and profile information. 
                    Simple, clean, no gamification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-b from-brand-background to-brand-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 via-brand-light-blue/5 to-brand-gray/5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-brand-blue/10 text-brand-blue border-brand-blue/20 px-4 py-2 text-sm">
              🚀 Get Started
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-heading font-bold neon-glow-blue">Ready to Discover Events?</h2>
            <p className="text-2xl text-brand-text-secondary leading-relaxed max-w-2xl mx-auto">
              Create your ViBE account to start discovering and attending events across Virginia.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/signup">
                <Button size="lg" className="btn-brand-primary px-10 py-6 text-xl font-semibold neon-shadow-blue">
                  Create Account
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-border text-brand-text-primary hover:bg-brand-card/50 px-10 py-6 text-xl font-semibold"
                >
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
