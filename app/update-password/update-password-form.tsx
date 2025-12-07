"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createSupabaseBrowser } from "@/lib/supabase/supabase-browser";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        toast({
          title: "Error",
          description: "Database connection not available",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <p className="text-brand-text-secondary mb-4">
          Your password has been updated successfully. Redirecting to login...
        </p>
        <Button asChild variant="outline" className="w-full border-brand-border text-brand-text-primary hover:bg-brand-card">
          <a href="/login">Go to Login</a>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-brand-text-primary">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-magenta focus:ring-brand-magenta placeholder:text-brand-text-secondary pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs text-brand-text-secondary">Password must be at least 8 characters long</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-brand-text-primary">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-brand-card text-brand-text-primary border-brand-border focus:border-brand-magenta focus:ring-brand-magenta placeholder:text-brand-text-secondary pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-brand-magenta text-black hover:bg-brand-magenta/90 neon-shadow-magenta"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
