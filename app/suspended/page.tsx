import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

export default async function SuspendedPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let suspensionReason: string | null = null;

  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("suspension_reason")
      .eq("id", user.id)
      .maybeSingle();
    const suspensionData = profile as { suspension_reason?: string } | null;
    suspensionReason = suspensionData?.suspension_reason || null;
  }

  return (
    <div className="relative min-h-screen bg-brand-background flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/10 via-brand-cyan/10 to-brand-green/10 opacity-70" />
      <div className="max-w-xl w-full space-y-6 relative z-10 bg-brand-card/80 border border-brand-border rounded-2xl p-8 shadow-2xl shadow-brand-magenta/20 backdrop-blur">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-brand-magenta uppercase tracking-wide">Account Hold</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">Your account is temporarily suspended</h1>
          <p className="text-base text-brand-text-secondary">
            For the safety of our community, this account cannot access the platform right now.
            Please review the details below and contact the Digital Builders team if you believe this is a mistake.
          </p>
        </div>

        {suspensionReason ? (
          <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-left shadow-inner">
            <p className="text-sm font-semibold text-brand-text-primary mb-2">Reason provided by moderator</p>
            <p className="text-brand-text-primary whitespace-pre-line">{suspensionReason}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-brand-background p-5 text-left shadow-inner">
            <p className="text-brand-text-primary">
              A Digital Builders moderator has suspended this account. Reach out to confirm the next steps.
            </p>
          </div>
        )}

        <div className="space-y-3 text-sm text-brand-text-secondary">
          <p>
            ✅ If you&apos;re a builder, contact support for next steps or appeals.<br />
            ✅ Active obligations (events/check-ins) will be handled appropriately.
          </p>
          <p className="text-brand-text-secondary">
            Suspensions are reviewed regularly. Replies typically take 1–2 business days.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="px-6 bg-brand-magenta text-black hover:bg-brand-magenta/90 neon-shadow-magenta">
            <Link href="mailto:support@digitalbuilders.world">Contact Support</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 border-brand-border text-brand-text-primary hover:bg-brand-card">
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

