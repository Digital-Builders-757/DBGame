"use client";

import {
  Users,
  Shield,
  Activity,
  BarChart,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminDashboardClientProps {
  totalUsers: number;
  totalAdmins: number;
}

export function AdminDashboardClient({ totalUsers, totalAdmins }: AdminDashboardClientProps) {
  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
                <div className="bg-blue-900/30 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Admins</p>
                  <p className="text-2xl font-bold text-white">{totalAdmins}</p>
                </div>
                <div className="bg-purple-900/30 p-2 rounded-full">
                  <Shield className="h-4 w-4 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-gray-900 border-gray-800">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 text-white data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 text-gray-400 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-green-400" />
                  Platform Health
                </CardTitle>
                <CardDescription className="text-gray-300">
                  System status and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white">
                      <Activity className="h-4 w-4 text-green-400" />
                      Database
                    </span>
                    <span className="text-green-400">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white">
                      <Activity className="h-4 w-4 text-green-400" />
                      Authentication
                    </span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-white">
                      <Activity className="h-4 w-4 text-green-400" />
                      Storage
                    </span>
                    <span className="text-green-400">Normal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Platform Analytics</CardTitle>
                <CardDescription className="text-gray-300">
                  Insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">Analytics dashboard coming soon.</p>
                  <p className="text-sm text-gray-400">Track platform performance, user engagement, and game metrics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
