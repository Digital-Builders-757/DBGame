"use client";

import {
  Search,
  MoreVertical,
  Filter,
  User as UserIcon,
  Shield,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoleDisplayName } from "@/lib/constants/user-roles";
// createNameSlug removed - TOTL-specific utility

type UserProfile = {
  id: string;
  role: "admin" | "user" | "client" | null;
  display_name: string | null;
  avatar_url: string | null;
  avatar_path: string | null;
  email_verified: boolean | null;
  created_at: string;
  updated_at: string;
};

interface AdminUsersClientProps {
  users: UserProfile[];
}

export function AdminUsersClient({ users: initialUsers }: AdminUsersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter users based on search query and active tab
  const filteredUsers = useMemo(() => {
    let filtered = initialUsers;

    // Filter by role based on active tab
    if (activeTab === "admins") {
      filtered = filtered.filter((u) => u.role === "admin");
    } else if (activeTab === "users") {
      filtered = filtered.filter((u) => u.role === "user");
    } else if (activeTab === "clients") {
      filtered = filtered.filter((u) => u.role === "client");
    }
    // "all" tab shows everyone

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.display_name?.toLowerCase().includes(query) ||
          u.id.toLowerCase().includes(query) ||
          getRoleDisplayName(u.role).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [initialUsers, searchQuery, activeTab]);

  // Group by role for stats
  const adminUsers = initialUsers.filter((u) => u.role === "admin");
  const userUsers = initialUsers.filter((u) => u.role === "user");
  const clientUsers = initialUsers.filter((u) => u.role === "client");

  const getRoleIcon = (role: string | null) => {
    if (!role) return null;
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-purple-400" />;
      case "client":
        return <Briefcase className="h-4 w-4 text-blue-400" />;
      case "user":
        return <UserIcon className="h-4 w-4 text-green-400" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role: string | null) => {
    if (!role) return <Badge variant="outline">No Role</Badge>;
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            Admin
          </Badge>
        );
      case "client":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            Client
          </Badge>
        );
      case "user":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            User
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              All Users
            </h1>
            <p className="text-gray-400 text-lg">View and manage all users on the platform</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium">
              {userUsers.length} Users
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium">
              {clientUsers.length} Clients
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium">
              {adminUsers.length} Admins
            </div>
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              <Link href="/admin/users/create">
                <Plus className="h-4 w-4" />
                Create User
              </Link>
            </Button>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800/80 to-gray-700/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Users</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    placeholder="Search by name, ID, or role..."
                    className="pl-9 w-full md:w-60 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="px-6 border-b border-gray-700">
              <TabsList className="h-12 bg-gray-700/50 border border-gray-600">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
                >
                  All ({initialUsers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
                >
                  Users ({userUsers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="clients"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
                >
                  Clients ({clientUsers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="admins"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
                >
                  Admins ({adminUsers.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <UserIcon className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">No Users Found</h3>
                  <p className="text-gray-400 text-lg">
                    {searchQuery
                      ? "Try adjusting your search query"
                      : "No users have been created yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          User
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Role
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Email Verified
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Joined
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          User ID
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredUsers.map((userProfile) => (
                        <tr key={userProfile.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {userProfile.display_name?.charAt(0).toUpperCase() || userProfile.id.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-white text-sm">
                                  {userProfile.display_name || "No name"}
                                </div>
                                <div className="text-gray-400 text-xs">{userProfile.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(userProfile.role)}
                              {getRoleBadge(userProfile.role)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {userProfile.email_verified ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-yellow-400" />
                                <span className="text-yellow-400 text-sm">Unverified</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-sm">
                            {new Date(userProfile.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-mono text-xs text-gray-400">{userProfile.id.slice(0, 8)}...</div>
                          </td>
                          <td className="py-4 px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/users/${userProfile.id}`}
                                    className="text-gray-300 hover:bg-gray-700 flex items-center"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <UserIcon className="h-10 w-10 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-lg">No users found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-gray-700/30 transition-colors duration-150 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                          {user.display_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-white font-medium truncate">
                              {user.display_name || "No name"}
                            </p>
                            {getRoleIcon(user.role)}
                            {getRoleBadge(user.role)}
                          </div>
                          <p className="text-gray-400 text-sm truncate">{user.id}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem className="text-white hover:bg-gray-700">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="clients" className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-blue-400" />
                  </div>
                  <p className="text-gray-400 text-lg">No clients found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-gray-700/30 transition-colors duration-150 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                          {user.display_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-white font-medium truncate">
                              {user.display_name || "No name"}
                            </p>
                            {getRoleIcon(user.role)}
                            {getRoleBadge(user.role)}
                          </div>
                          <p className="text-gray-400 text-sm truncate">{user.id}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem className="text-white hover:bg-gray-700">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="admins" className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Shield className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">No Admin Users</h3>
                  <p className="text-gray-400 text-lg">There are currently no admin users.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          User
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Role
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Email Verified
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Joined
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          User ID
                        </th>
                        <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider py-4 px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredUsers.map((userProfile) => (
                        <tr key={userProfile.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {userProfile.display_name?.charAt(0).toUpperCase() || userProfile.id.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-white text-sm">
                                  {userProfile.display_name || "No name"}
                                </div>
                                <div className="text-gray-400 text-xs">{userProfile.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {getRoleBadge(userProfile.role)}
                          </td>
                          <td className="py-4 px-6">
                            {userProfile.email_verified ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-green-400 text-sm">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-yellow-400" />
                                <span className="text-yellow-400 text-sm">Unverified</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-sm">
                            {new Date(userProfile.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-mono text-xs text-gray-400">{userProfile.id.slice(0, 8)}...</div>
                          </td>
                          <td className="py-4 px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                                  <Shield className="mr-2 h-4 w-4" />
                                  Admin Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

