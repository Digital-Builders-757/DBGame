"use client";

import { ArrowLeft, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createSupabaseBrowser } from "@/lib/supabase/supabase-browser";

export default function VerificationPendingPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const [isSending, setIsSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"unknown" | "sent" | "error">("unknown");
  const { toast } = useToast();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    // Check if we just created the account
    const justCreated = searchParams?.get("new") === "true";
    if (justCreated) {
      setEmailStatus("sent");
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email address is missing",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      if (!supabase) {
        toast({
          title: "Error",
          description: "Database connection not available",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Error resending verification email:", error);
        throw new Error(error.message);
      }

      setJustSent(true);
      setEmailStatus("sent");
      toast({
        title: "Email sent",
        description: "Verification email has been sent to your inbox",
      });

      setTimeout(() => {
        setJustSent(false);
      }, 30000);
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setEmailStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-background pt-16 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/10 via-brand-cyan/10 to-brand-green/10 opacity-70" />
      <div className="mx-auto max-w-screen-sm px-4 py-10 sm:py-14 relative z-10">
        <Link href="/" className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-brand-border bg-brand-card/80 backdrop-blur p-8 shadow-2xl shadow-brand-magenta/20">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="space-y-3">
              <div className="w-16 h-16 bg-brand-magenta/15 border border-brand-magenta/30 rounded-full mx-auto flex items-center justify-center">
                <Mail className="h-8 w-8 text-brand-magenta" />
              </div>
              <CardTitle className="text-center text-brand-text-primary">Verify your email</CardTitle>
              <CardDescription className="text-center text-brand-text-secondary">
                We&apos;ve sent a verification email to <strong className="text-brand-text-primary">{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-brand-text-secondary">
                Please check your inbox and click the verification link to complete your registration.
              </p>

              {emailStatus === "sent" && (
                <Alert className="bg-brand-green/10 border-brand-green/40">
                  <CheckCircle2 className="h-4 w-4 text-brand-green" />
                  <AlertDescription className="text-brand-text-primary">
                    {justSent
                      ? "Verification email has been resent successfully!"
                      : "Verification email has been sent!"}
                  </AlertDescription>
                </Alert>
              )}

              {emailStatus === "error" && (
                <Alert className="bg-brand-cyan/10 border-brand-cyan/40">
                  <AlertTriangle className="h-4 w-4 text-brand-cyan" />
                  <AlertDescription className="text-brand-text-primary">
                    There was an issue sending the verification email. Please try again or contact support.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                <h4 className="font-medium mb-2 text-brand-text-primary">Didn&apos;t receive the email?</h4>
                <ul className="text-sm text-brand-text-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">•</span>
                    Check your spam or junk folder
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">•</span>
                    Make sure you entered the correct email address
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">•</span>
                    Wait a few minutes for the email to arrive
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">•</span>
                    If you still don&apos;t see it, try clicking the resend button below
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handleResendEmail}
                disabled={isSending || justSent}
                className="w-full border-brand-border text-brand-text-primary hover:bg-brand-card"
                variant="outline"
              >
                {isSending ? "Sending..." : justSent ? "Email sent" : "Resend verification email"}
              </Button>
              <div className="text-center text-sm text-brand-text-secondary">
                Already verified?{" "}
                <Link
                  href="/login"
                  className="text-brand-magenta font-semibold hover:text-brand-text-primary hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
