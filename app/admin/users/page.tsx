import { redirect } from "next/navigation";
import { AdminUsersClient } from "./admin-users-client";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

// Temporary type until Digital Builders schema is created
type ProfileRow = {
  role: string;
};

// Force dynamic rendering to prevent static pre-rendering
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServer();

  // Check if user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?returnUrl=/admin/users");
  }

  // Get user role from profiles table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userData, error: userError } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id as string)
    .single();

  if (userError || (userData as ProfileRow)?.role !== "admin") {
    redirect("/login?returnUrl=/admin/users");
  }

  // Fetch all users with their profiles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profiles, error: profilesError } = await (supabase as any)
    .from("profiles")
    .select(`
      id,
      role,
      display_name,
      avatar_url,
      avatar_path,
      email_verified,
      created_at,
      updated_at
    `)
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return <AdminUsersClient users={[]} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <AdminUsersClient users={(profiles || []) as any} />;
}

