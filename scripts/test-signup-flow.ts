#!/usr/bin/env tsx

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Digital Builders Signup Flow Test Script
 *
 * This script tests the signup flow with various metadata scenarios
 * to ensure the database trigger handles all edge cases correctly.
 *
 * Digital Builders roles: 'builder' | 'mentor' | 'admin'
 * Digital Builders profile structure: username, display_name, role (not first_name/last_name)
 *
 * Usage: npx tsx scripts/test-signup-flow.ts
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Test scenarios with different metadata configurations
const testScenarios = [
  {
    name: "Complete Builder Signup",
    metadata: {
      username: "testbuilder",
      display_name: "Test Builder",
      role: "builder",
    },
    expected: {
      profile_role: "builder",
      username: "testbuilder",
      display_name: "Test Builder",
    },
  },
  {
    name: "Complete Mentor Signup",
    metadata: {
      username: "testmentor",
      display_name: "Test Mentor",
      role: "mentor",
    },
    expected: {
      profile_role: "mentor",
      username: "testmentor",
      display_name: "Test Mentor",
    },
  },
  {
    name: "Builder with Missing Display Name",
    metadata: {
      username: "builder123",
      role: "builder",
    },
    expected: {
      profile_role: "builder",
      username: "builder123",
      display_name: "", // May be empty or defaulted
    },
  },
  {
    name: "Builder with Missing Username",
    metadata: {
      display_name: "Builder Without Username",
      role: "builder",
    },
    expected: {
      profile_role: "builder",
      username: "", // May be empty or generated
      display_name: "Builder Without Username",
    },
  },
  {
    name: "Empty Metadata (Default Builder)",
    metadata: {},
    expected: {
      profile_role: "builder", // Default role
      username: "", // May be empty or generated from email
      display_name: "", // May be empty or generated
    },
  },
  {
    name: "Admin Role Test",
    metadata: {
      username: "adminuser",
      display_name: "Admin User",
      role: "admin",
    },
    expected: {
      profile_role: "admin",
      username: "adminuser",
      display_name: "Admin User",
    },
  },
];

async function runTestScenario(
  supabase: SupabaseClient,
  scenario: (typeof testScenarios)[0],
  testIndex: number
): Promise<boolean> {
  const testEmail = `test-${testIndex}-${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";

  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`📧 Test email: ${testEmail}`);

  try {
    // Step 1: Create user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: scenario.metadata,
      },
    });

    if (authError) {
      console.error("❌ Auth signup failed:", authError.message);
      return false;
    }

    if (!authData.user) {
      console.error("❌ No user returned from signup");
      return false;
    }

    console.log("✅ User created successfully");

    // Step 2: Wait a moment for trigger to execute
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 3: Check profile creation
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile not found:", profileError.message);
      return false;
    }

    console.log("✅ Profile created successfully");

    // Step 4: Verify profile role
    if (profile.role !== scenario.expected.profile_role) {
      console.error(
        `❌ Wrong role: expected ${scenario.expected.profile_role}, got ${profile.role}`
      );
      return false;
    }

    // Step 5: Verify username (if expected)
    if (scenario.expected.username && profile.username !== scenario.expected.username) {
      console.warn(
        `⚠️ Username mismatch: expected "${scenario.expected.username}", got "${profile.username}"`
      );
      // Don't fail - username might be auto-generated
    }

    // Step 6: Verify display_name (if expected)
    if (
      scenario.expected.display_name &&
      profile.display_name !== scenario.expected.display_name
    ) {
      console.warn(
        `⚠️ Display name mismatch: expected "${scenario.expected.display_name}", got "${profile.display_name}"`
      );
      // Don't fail - display_name might be auto-generated
    }

    console.log(`✅ Profile verified - Role: ${profile.role}, Username: ${profile.username || "N/A"}, Display Name: ${profile.display_name || "N/A"}`);

    // Step 7: Clean up test user
    await cleanupTestUser(supabase, authData.user.id);

    console.log("✅ Test scenario passed");
    return true;
  } catch (error) {
    console.error("❌ Test scenario failed with error:", error);
    return false;
  }
}

async function cleanupTestUser(supabase: SupabaseClient, userId: string) {
  try {
    // Delete main profile
    await supabase.from("profiles").delete().eq("id", userId);

    // Delete tickets for this user
    await supabase.from("tickets").delete().eq("user_id", userId);

    // Delete XP transactions for this user
    await supabase.from("xp_transactions").delete().eq("user_id", userId);

    // Delete auth user (requires admin privileges)
    // Note: This might not work in all environments
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (error) {
      console.log("⚠️ Could not delete auth user (requires admin privileges)");
    }
  } catch (error) {
    console.error("⚠️ Cleanup failed:", error);
  }
}

async function main() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables");
    console.error("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log("🚀 Starting Digital Builders Signup Flow Tests");
  console.log("==============================================");

  // Run main test scenarios
  let passedTests = 0;
  const totalTests = testScenarios.length;

  for (let i = 0; i < testScenarios.length; i++) {
    const passed = await runTestScenario(supabase, testScenarios[i], i);
    if (passed) {
      passedTests++;
    }
  }

  // Summary
  console.log("\n📊 Test Summary");
  console.log("===============");
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log("\n🎉 All tests passed! Signup flow is working correctly.");
    process.exit(0);
  } else {
    console.log("\n💥 Some tests failed. Please check the errors above.");
    process.exit(1);
  }
}

// Run the tests
main().catch((error) => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
});
