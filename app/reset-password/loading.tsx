import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background">
      <LoadingSpinner size="lg" />
    </div>
  );
}
