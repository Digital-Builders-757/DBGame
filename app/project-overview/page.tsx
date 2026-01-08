import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectOverview() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Digital Builders Project Overview</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Use this page to navigate between different parts of the application during your
              presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Events Portal</CardTitle>
                <CardDescription>
                  Browse and RSVP to Digital Builders events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                  <Link href="/events">View Events</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Builder Card</CardTitle>
                <CardDescription>
                  View your builder card with XP and badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                  <Link href="/builder-card">View Builder Card</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Access admin panel and user management</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Homepage</CardTitle>
                <CardDescription>View the main landing page</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                  <Link href="/">View Homepage</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a builder account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">Create Account</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/settings">Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
