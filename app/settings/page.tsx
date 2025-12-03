import { redirect } from "next/navigation";
import { ProfileEditor } from "./profile-editor";
import { PrefetchLink } from "@/components/ui/prefetch-link";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";


// Force dynamic rendering to prevent build-time issues
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="h-12 w-12 text-red-500 mx-auto mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">
            Supabase is not configured. Please check your environment variables.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServer();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch profile data - Digital Builders uses simplified profile structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select(
      "id, role, display_name, avatar_url, avatar_path, email_verified, created_at, updated_at"
    )
    .eq("id", user.id)
    .single();

  // Generate signed URL with image transformations for avatar if path exists
  let avatarSrc: string | null = null;
  if (profile?.avatar_path) {
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(profile.avatar_path, 60 * 60 * 24 * 7, {
        transform: {
          width: 200,
          height: 200,
          resize: "cover",
        },
      }); // 7 days with optimizations
    avatarSrc = signed?.signedUrl ?? null;
  }

  // Digital Builders doesn't use portfolio items - simplified profile structure

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              {profile?.role === "admin" ? (
                <>
                  <PrefetchLink href="/admin/dashboard" className="hover:text-white transition-colors">
                    Admin Dashboard
                  </PrefetchLink>
                  <span>→</span>
                  <span className="text-white">Settings</span>
                </>
              ) : (
                <>
                  <PrefetchLink href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </PrefetchLink>
                  <span>→</span>
                  <span className="text-white">Settings</span>
                </>
              )}
            </nav>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-300">Manage your account and profile information</p>
              </div>
              {profile?.role === "admin" ? (
                <PrefetchLink
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Admin
                </PrefetchLink>
              ) : (
                <PrefetchLink
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </PrefetchLink>
              )}
            </div>
          </div>

          <ProfileEditor
            user={user}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile={profile as any}
            avatarSrc={avatarSrc}
          />
        </div>
      </div>
    </div>
  );
}
