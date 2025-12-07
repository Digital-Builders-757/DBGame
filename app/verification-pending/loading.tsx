import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerificationPendingLoading() {
  return (
    <div className="relative min-h-screen bg-brand-background pt-16 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-magenta/10 via-brand-cyan/10 to-brand-green/10 opacity-70" />
      <div className="mx-auto max-w-screen-sm px-4 py-10 sm:py-14 relative z-10">
        <div className="rounded-2xl border border-brand-border bg-brand-card/80 backdrop-blur p-8 shadow-2xl shadow-brand-magenta/20">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <div className="w-16 h-16 bg-brand-magenta/15 border border-brand-magenta/30 rounded-full mx-auto flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-brand-magenta border-t-transparent rounded-full animate-spin"></div>
              </div>
              <CardTitle className="text-center text-brand-text-primary">Loading...</CardTitle>
              <CardDescription className="text-center text-brand-text-secondary">Please wait</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-brand-border rounded animate-pulse"></div>
              <div className="h-4 bg-brand-border rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                <div className="h-4 bg-brand-border rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-brand-border rounded animate-pulse"></div>
                  <div className="h-3 bg-brand-border rounded animate-pulse"></div>
                  <div className="h-3 bg-brand-border rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
