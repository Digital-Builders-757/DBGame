/**
 * Reusable shell component for Events page.
 * Prevents duplication of layout structure across success, error, and catch states.
 */
export function EventsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-brand-background text-brand-text-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/12 via-brand-light-blue/10 to-brand-gray/10 opacity-90" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-8">
        {children}
      </div>
    </div>
  );
}
