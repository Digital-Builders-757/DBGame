import { createSupabaseServer } from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Calendar, MapPin, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventPassPage() {
  const supabase = await createSupabaseServer();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Query event_pass_view for current user
  const { data: eventPass, error } = await supabase
    .from("event_pass_view")
    .select("profile_id, username, display_name, avatar_url, region, events_attended_count, last_event_at")
    .eq("profile_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching event pass:", error);
    // Still render page with fallback UI
  }

  const passData = eventPass || {
    profile_id: user.id,
    username: null,
    display_name: null,
    avatar_url: null,
    region: null,
    events_attended_count: 0,
    last_event_at: null,
  };

  // Format last event date if available
  const lastEventDate = passData.last_event_at
    ? new Date(passData.last_event_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/15 via-brand-cyan/12 to-brand-green/12 opacity-90" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
            Event Pass
          </span>
        </div>

        {/* Event Pass Card */}
        <div className="rounded-2xl border border-brand-border bg-brand-card/70 backdrop-blur p-8 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-6">
            <div className="relative">
              {passData.avatar_url ? (
                <SafeImage
                  src={passData.avatar_url}
                  alt={passData.display_name || passData.username || "User"}
                  className="w-24 h-24 rounded-full border-2 border-brand-magenta/50"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-brand-magenta/50 bg-brand-card flex items-center justify-center">
                  <User className="w-12 h-12 text-brand-text-secondary" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold neon-glow-blue">
            {passData.display_name || passData.username || "ViBE User"}
          </h1>
              {passData.username && passData.username !== passData.display_name && (
                <p className="text-lg text-brand-text-secondary">@{passData.username}</p>
              )}
              {passData.region && (
                <div className="flex items-center gap-2 text-brand-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{passData.region}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-brand-border">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-text-secondary">
                <Calendar className="w-5 h-5" />
                <span className="text-sm uppercase tracking-[0.15em]">Events Attended</span>
              </div>
              <p className="text-4xl font-bold text-brand-blue">
                {passData.events_attended_count || 0}
              </p>
            </div>
            {lastEventDate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-text-secondary">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.15em]">Last Event</span>
                </div>
                <p className="text-lg font-semibold">{lastEventDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link href="/events" className="w-full sm:w-auto">
            <button className="btn-brand-secondary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-green">
              View Events
            </button>
          </Link>
          <Link href="/profile" className="w-full sm:w-auto">
            <button className="btn-brand-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto neon-shadow-blue">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
