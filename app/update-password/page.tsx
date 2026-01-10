import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "./update-password-form";
import { Button } from "@/components/ui/button";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

// Force dynamic rendering to prevent static pre-rendering
export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; access_token?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const params = await searchParams;
  const tokenHash = params.token_hash;
  const type = params.type;
  const accessToken = params.access_token;

  // Handle password reset token verification
  if (tokenHash && type === "recovery") {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (error) {
        return (
          <div className="relative min-h-screen bg-brand-background pt-16 sm:pt-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-70" />
            <div className="mx-auto max-w-screen-sm px-4 py-10 sm:py-14 relative z-10">
              <Link
                href="/login"
                className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-8 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>

              <div className="rounded-2xl border border-brand-border bg-brand-card/80 backdrop-blur p-8 shadow-2xl shadow-brand-blue/20">
                <div className="text-center space-y-3 mb-6">
                  <div className="font-mono text-3xl font-bold">
                    <span className="text-brand-gray">{"{"}</span>
                    <span className="text-brand-light-blue">Vi</span>
                    <span className="text-brand-gray">{"}"}</span>
                    <span className="text-brand-blue">;</span>
                  </div>
                  <h1 className="text-2xl font-bold text-brand-text-primary">Invalid Reset Link</h1>
                  <p className="text-brand-text-secondary">
                    This reset link is expired or invalid. Please request a new link.
                  </p>
                </div>
                <Button asChild className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 neon-shadow-blue">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            </div>
          </div>
        );
      }

      // Token is valid - show password reset form
      return (
        <div className="relative min-h-screen bg-brand-background pt-16 sm:pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-70" />
          <div className="mx-auto max-w-screen-sm px-4 py-10 sm:py-14 relative z-10">
            <Link
              href="/login"
              className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>

            <div className="rounded-2xl border border-brand-border bg-brand-card/80 backdrop-blur p-8 shadow-2xl shadow-brand-blue/20">
              <div className="text-center space-y-3 mb-6">
                <div className="font-mono text-3xl font-bold">
                  <span className="text-brand-gray">{"{"}</span>
                  <span className="text-brand-light-blue">Vi</span>
                  <span className="text-brand-gray">{"}"}</span>
                  <span className="text-brand-blue">;</span>
                </div>
                <h1 className="text-2xl font-bold text-brand-text-primary">Set New Password</h1>
                <p className="text-brand-text-secondary">Create a new password for your account.</p>
              </div>

              <UpdatePasswordForm />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Token verification error:", error);
      redirect("/login?error=invalid_token");
    }
  }

  // Handle access token (for OAuth flows)
  if (accessToken) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        redirect("/login?error=invalid_token");
      }

      // User is authenticated - show password reset form
      return (
        <div className="relative min-h-screen bg-brand-background pt-16 sm:pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-70" />
          <div className="mx-auto max-w-screen-sm px-4 py-10 sm:py-14 relative z-10">
            <Link
              href="/login"
              className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>

            <div className="rounded-2xl border border-brand-border bg-brand-card/80 backdrop-blur p-8 shadow-2xl shadow-brand-blue/20">
              <div className="text-center space-y-3 mb-6">
                <div className="font-mono text-3xl font-bold">
                  <span className="text-brand-gray">{"{"}</span>
                  <span className="text-brand-light-blue">Vi</span>
                  <span className="text-brand-gray">{"}"}</span>
                  <span className="text-brand-blue">;</span>
                </div>
                <h1 className="text-2xl font-bold text-brand-text-primary">Update Password</h1>
                <p className="text-brand-text-secondary">Create a new password for your account.</p>
              </div>

              <UpdatePasswordForm />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Access token verification error:", error);
      redirect("/login?error=invalid_token");
    }
  }

  // No valid token provided - redirect to login
  redirect("/login?error=missing_token");
}
