"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin Header Component
 * Placeholder for Digital Builders admin interface
 */
export function AdminHeader() {
  const pathname = usePathname();

  return (
    <div className="border-b border-brand-border bg-brand-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-brand-text-light neon-glow-primary">Digital Builders Admin</h1>
            <p className="text-sm text-brand-text-dark">Administration Dashboard</p>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-2 rounded font-mono transition-colors ${
                pathname === "/admin/dashboard"
                  ? "bg-brand-primary/20 text-brand-primary font-medium"
                  : "text-brand-text-dark hover:text-brand-primary hover:bg-brand-primary/10"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={`px-3 py-2 rounded font-mono transition-colors ${
                pathname?.startsWith("/admin/users")
                  ? "bg-brand-primary/20 text-brand-primary font-medium"
                  : "text-brand-text-dark hover:text-brand-primary hover:bg-brand-primary/10"
              }`}
            >
              Users
            </Link>
            <Link
              href="/admin/diagnostic"
              className={`px-3 py-2 rounded font-mono transition-colors ${
                pathname === "/admin/diagnostic"
                  ? "bg-brand-primary/20 text-brand-primary font-medium"
                  : "text-brand-text-dark hover:text-brand-primary hover:bg-brand-primary/10"
              }`}
            >
              Diagnostic
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

