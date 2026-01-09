"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function BuilderSignupForm() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      // Prepare user metadata - include display_name if provided
      const userMetadata: Record<string, unknown> = {};
      if (displayName.trim()) {
        userMetadata.display_name = displayName.trim();
      }

      const { error } = await signUp(email, password, {
        data: userMetadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) {
        console.error("Signup error:", error);
        if (error.message.includes("already registered")) {
          setFormErrors({
            auth: "An account with this email already exists. Please sign in instead.",
          });
        } else {
          toast({
            title: "Error creating account",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // Success - show verification message
      setSignupSuccess(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Unexpected signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-brand-background pt-4 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-60" />

        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-4 sm:mb-6 md:mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="max-w-md mx-auto bg-brand-card border border-brand-border rounded-2xl shadow-2xl shadow-brand-blue/20 overflow-hidden backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-brand-blue via-brand-light-blue to-brand-gray" />
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-brand-blue" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary">
                  Check Your Email
                </h1>
                <p className="text-brand-text-secondary">
                  We&apos;ve sent a verification link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-brand-text-secondary">
                  Click the link in the email to verify your account and get started.
                </p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full btn-brand-primary">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background pt-4 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 relative overflow-hidden">
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-60" />

      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-4 sm:mb-6 md:mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-md mx-auto bg-brand-card border border-brand-border rounded-2xl shadow-2xl shadow-brand-blue/20 overflow-hidden backdrop-blur-sm">
          <div className="h-1 bg-gradient-to-r from-brand-blue via-brand-light-blue to-brand-gray" />
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="font-mono text-3xl font-bold">
                <span className="text-brand-gray">{"{"}</span>
                <span className="text-brand-light-blue">Vi</span>
                <span className="text-brand-gray">{"}"}</span>
                <span className="text-brand-blue">;</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-text-primary">
                Create Your ViBE Account
              </h1>
              <p className="text-sm sm:text-base text-brand-text-secondary">
                Join ViBE to RSVP to events, check in, and track your attendance.
              </p>
            </div>

            {formErrors.auth && (
              <Alert variant="destructive" className="bg-red-900/30 border-red-700">
                <AlertTitle className="text-red-300">Signup Error</AlertTitle>
                <AlertDescription className="text-red-200">{formErrors.auth}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className={`text-brand-text-primary text-sm sm:text-base ${formErrors.email ? "text-red-400" : ""}`}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors((prev) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { email: _, ...rest } = prev;
                        return rest;
                      });
                    }
                    if (formErrors.auth) {
                      setFormErrors((prev) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { auth: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  required
                  className={`bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-magenta focus:ring-brand-magenta text-base placeholder:text-brand-text-secondary ${formErrors.email ? "border-red-500" : ""}`}
                />
                {formErrors.email && <p className="text-sm text-red-400 mt-1">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="password"
                  className={`text-brand-text-primary text-sm sm:text-base ${formErrors.password ? "text-red-400" : ""}`}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password (min. 6 characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) {
                        setFormErrors((prev) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { password: _, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    required
                    minLength={6}
                    className={`bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-blue focus:ring-brand-blue text-base placeholder:text-brand-text-secondary pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-400 mt-1">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="displayName" className="text-brand-text-primary text-sm sm:text-base">
                  Display Name <span className="text-brand-text-secondary">(optional)</span>
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-blue focus:ring-brand-blue text-base placeholder:text-brand-text-secondary"
                />
                <p className="text-xs text-brand-text-secondary">
                  This will appear on your Event Pass. If left blank, we&apos;ll use your email username.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-brand-primary neon-shadow-blue"
                loading={isLoading}
                loadingText="Creating account..."
              >
                {isLoading ? "Creating account..." : "Create ViBE Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-brand-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-blue hover:text-brand-light-blue transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
