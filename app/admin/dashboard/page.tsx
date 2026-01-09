import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./admin-dashboard-client";
import { createSupabaseServer } from "@/lib/supabase/supabase-server";

// Temporary type until ViBE schema is finalized
type ProfileRow = {
  role: string;
};

// Force dynamic rendering to prevent static pre-rendering
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();

  // Check if user is authenticated and is admin
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?returnUrl=/admin/dashboard");
  }

  // Get user role from profiles table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userData, error: userError } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id as string)
    .single();

  if (userError || (userData as ProfileRow)?.role !== "admin") {
    redirect("/login?returnUrl=/admin/dashboard");
  }

  // Fetch dashboard data - ViBE simplified stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: totalUsers } = await (supabase as any)
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: totalAdmins } = await (supabase as any)
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  return (
    <AdminDashboardClient
      totalUsers={totalUsers || 0}
      totalAdmins={totalAdmins || 0}
    />
  );
}
