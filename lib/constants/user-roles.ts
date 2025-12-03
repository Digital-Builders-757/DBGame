/**
 * User Role Constants and Utilities
 * Digital Builders user role definitions
 */

export type UserRole = "admin" | "user";

/**
 * Get display name for a user role
 */
export function getRoleDisplayName(role: string | null | undefined): string {
  if (!role) return "User";
  
  switch (role.toLowerCase()) {
    case "admin":
      return "Admin";
    case "user":
      return "User";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}

/**
 * Check if role is admin
 */
export function isAdmin(role: string | null | undefined): boolean {
  return role?.toLowerCase() === "admin";
}

/**
 * Check if role is user
 */
export function isUser(role: string | null | undefined): boolean {
  return !role || role.toLowerCase() === "user";
}

