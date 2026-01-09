"use client";

import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { AvatarUpload } from "./avatar-upload";
import { AccountSettingsSection } from "./sections/account-settings";
import { BasicInfoSection } from "./sections/basic-info";
// ViBE uses simplified profile structure (no talent/client split)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Temporary type until ViBE schema is finalized
type Profile = {
  id: string;
  role: string;
  display_name: string | null;
  avatar_url: string | null;
  avatar_path: string | null;
  email_verified: boolean | null;
  created_at: string;
  updated_at: string;
};

// Type for the exact columns we select
type ProfileData = Pick<
  Profile,
  | "id"
  | "role"
  | "display_name"
  | "avatar_url"
  | "avatar_path"
  | "email_verified"
  | "created_at"
  | "updated_at"
>;

interface ProfileEditorProps {
  user: User;
  profile: ProfileData;
  avatarSrc: string | null;
}

export function ProfileEditor({ user, profile, avatarSrc }: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="space-y-6">
      {/* Profile Header with Avatar */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AvatarUpload
              currentAvatarUrl={avatarSrc}
              userEmail={user.email || ""}
              displayName={profile.display_name}
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.display_name || "Profile"}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Tabbed Interface */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardDescription className="text-gray-300">
            Manage your profile information and account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-sm md:text-base px-2 md:px-4 py-2"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 text-sm md:text-base px-2 md:px-4 py-2"
              >
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <BasicInfoSection user={user} profile={profile} />
            </TabsContent>

            <TabsContent value="account" className="space-y-4 mt-6">
              <AccountSettingsSection user={user} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
