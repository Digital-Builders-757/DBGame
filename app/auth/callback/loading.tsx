import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background p-4">
      <Card className="w-full max-w-md bg-brand-card border-brand-border">
        <CardHeader>
          <CardTitle className="text-center text-brand-text-primary">Email Verification</CardTitle>
          <CardDescription className="text-center text-brand-text-secondary">Verifying your email address...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-brand-magenta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-brand-text-secondary">Please wait while we verify your email...</p>
        </CardContent>
      </Card>
    </div>
  );
}
