"use client";

import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { handleLoginRedirect } from "@/lib/actions/auth-actions";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [verified, setVerified] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const { signIn, userRole } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Safely extract search params in useEffect to avoid SSR issues
  useEffect(() => {
    if (searchParams) {
      const returnUrlParam = searchParams.get("returnUrl");
      const verifiedParam = searchParams.get("verified") === "true";
      setReturnUrl(returnUrlParam);
      setVerified(verifiedParam);
      
      if (verifiedParam) {
        toast({
          title: "Email verified successfully!",
          description: "You can now log in to your account.",
          variant: "default",
        });
      }
    }
  }, [searchParams, toast]);

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
    setFormErrors({}); // Clear any existing errors

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          setFormErrors({
            auth: "Invalid email or password. Please try again.",
          });
        } else if (error.message.includes("Email not confirmed")) {
          setFormErrors({
            auth: "Please verify your email address before signing in.",
          });
        } else {
          toast({
            title: "Error signing in",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      toast({
        title: "Signed in successfully!",
        description: "Redirecting to your dashboard...",
      });

      // Use server-side redirect to ensure fresh session and profile check
      // This prevents stale cookie/cache issues
      try {
        await handleLoginRedirect(returnUrl ?? undefined);
      } catch (error) {
        // If server redirect fails, fall back to client-side redirect
        console.error("Server redirect failed, using client redirect:", error);
        // Force a hard refresh to clear any cached state
        // Use userRole from auth provider to redirect correctly
        const redirectPath =
          userRole === "admin"
            ? "/admin/dashboard"
            : "/events";
        window.location.href = redirectPath;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background pt-4 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 relative overflow-hidden">
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-brand-light-blue/10 to-brand-gray/10 opacity-60" />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-brand-text-secondary hover:text-brand-text-primary mb-4 sm:mb-6 md:mb-6 transition-colors">
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
              <h1 className="text-xl sm:text-2xl font-bold text-brand-text-primary">Welcome Back</h1>
              <p className="text-sm sm:text-base text-brand-text-secondary">
                Sign in to your ViBE account. You need a ViBE account to attend events.
              </p>
            </div>

            {verified && (
              <Alert className="bg-brand-blue/10 border-brand-blue/40 mb-6">
                <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                <AlertTitle className="text-brand-blue">Email verified successfully!</AlertTitle>
                <AlertDescription className="text-brand-text-primary">
                  You can now log in to your account.
                </AlertDescription>
              </Alert>
            )}

            {formErrors.auth && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-md text-sm">
                {formErrors.auth}
              </div>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className={`text-brand-text-primary text-sm sm:text-base ${formErrors.email ? "text-red-400" : ""}`}>
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
                  className={`bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-blue focus:ring-brand-blue text-base placeholder:text-brand-text-secondary ${formErrors.email ? "border-red-500" : ""}`}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className={`text-brand-text-primary text-sm sm:text-base ${formErrors.password ? "text-red-400" : ""}`}>
                    Password
                  </Label>
                  <Link href="/update-password" className="text-xs sm:text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                      if (formErrors.auth) {
                        setFormErrors((prev) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { auth: _, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    required
                    className={`bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-blue focus:ring-brand-blue text-base placeholder:text-brand-text-secondary ${formErrors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-400 mt-1">{formErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 font-semibold transition-all duration-200 border-0 shadow-lg hover:shadow-xl neon-shadow-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 sm:mt-8 mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-brand-card px-2 text-brand-text-secondary">New to ViBE?</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="text-center">
                <p className="text-sm sm:text-base text-brand-text-secondary">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={returnUrl ? `/create-account?returnUrl=${returnUrl}` : "/create-account"}
                    className="text-brand-blue font-medium hover:text-brand-text-primary inline-block transition-colors"
                  >
                    Create an account →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
