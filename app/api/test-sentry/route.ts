import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

/**
 * Server-side Sentry test endpoint
 * GET /api/test-sentry?type=error|message|exception
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testType = searchParams.get("type") || "message";

  try {
    switch (testType) {
      case "error": {
        // Throw an unhandled error (will be caught by Sentry's error handler)
        const testError = new Error("🧪 Server-side test error from ViBE API - This should appear in Sentry!");
        // Explicitly capture it to ensure it's sent
        const eventId = Sentry.captureException(testError, {
          tags: {
            feature: "api-test",
            test: true,
            endpoint: "/api/test-sentry",
            testType: "forced-error",
          },
          extra: {
            context: "Testing server-side Sentry error reporting",
            timestamp: new Date().toISOString(),
            testPurpose: "Verify Sentry connection is working",
          },
          level: "error",
        });
        console.log("[Sentry Test] Error captured and sent to Sentry. Event ID:", eventId);
        const org = process.env.SENTRY_ORG || 'digital-builders';
        const project = process.env.SENTRY_PROJECT || 'digital-builders-frontend';
        const sentryUrl = `https://sentry.io/organizations/${org}/projects/${project}/`;
        console.log(`[Sentry Test] Check Sentry dashboard: ${sentryUrl}`);
        
        // Also flush to ensure it's sent immediately
        await Sentry.flush(2000);
        
        return NextResponse.json({
          success: true,
          message: "Test error thrown and captured",
          eventId: eventId,
          testType: "error",
          note: "Error should appear in Sentry dashboard within 5-10 seconds",
          sentryUrl: sentryUrl,
        });
      }

      case "exception":
        // Capture a handled exception
        try {
          throw new Error("Simulated server error: Database connection failed - This should appear in Sentry!");
        } catch (error) {
          const exceptionId = Sentry.captureException(error, {
            tags: {
              feature: "api-test",
              test: true,
              endpoint: "/api/test-sentry",
              testType: "handled-exception",
            },
            extra: {
              context: "Testing server-side Sentry integration",
              timestamp: new Date().toISOString(),
              testPurpose: "Verify handled exceptions are captured",
            },
            level: "error",
          });
          console.log("[Sentry Test] Exception captured and sent to Sentry. Event ID:", exceptionId);
          const org = process.env.SENTRY_ORG || 'digital-builders';
          const project = process.env.SENTRY_PROJECT || 'digital-builders-frontend';
          console.log(`[Sentry Test] Check Sentry dashboard: https://sentry.io/organizations/${org}/projects/${project}/`);
          
          // Flush to ensure it's sent immediately
          await Sentry.flush(2000);
          
          return NextResponse.json({
            success: true,
            message: "Exception captured and sent to Sentry",
            eventId: exceptionId,
            testType: "exception",
            note: "Exception should appear in Sentry dashboard within 5-10 seconds",
            sentryUrl: `https://sentry.io/organizations/${process.env.SENTRY_ORG || 'digital-builders'}/projects/${process.env.SENTRY_PROJECT || 'digital-builders-frontend'}/`,
          });
        }

      case "message":
      default: {
        // Send an info message
        const messageId = Sentry.captureMessage("✅ Server-side test message: Sentry API integration working!", "info");
        console.log("[Sentry Test] Message sent to Sentry. Event ID:", messageId);
        const org = process.env.SENTRY_ORG || 'digital-builders';
        const project = process.env.SENTRY_PROJECT || 'digital-builders-frontend';
        console.log(`[Sentry Test] Check Sentry dashboard: https://sentry.io/organizations/${org}/projects/${project}/`);
        
        // Flush to ensure it's sent immediately
        await Sentry.flush(2000);
        
        return NextResponse.json({
          success: true,
          message: "Message sent to Sentry",
          eventId: messageId,
          testType: "message",
          note: "Message should appear in Sentry dashboard within 5-10 seconds",
            sentryUrl: `https://sentry.io/organizations/${process.env.SENTRY_ORG || 'digital-builders'}/projects/${process.env.SENTRY_PROJECT || 'digital-builders-frontend'}/`,
        });
      }
    }
  } catch (error) {
    // Ensure error is captured by Sentry (in case automatic handler didn't catch it)
    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: {
          feature: "api-test",
          test: true,
          endpoint: "/api/test-sentry",
          caughtIn: "catch-block",
        },
        extra: {
          context: "Error caught in route handler catch block",
          timestamp: new Date().toISOString(),
        },
        level: "error",
      });
      console.log("[Sentry Test] Error caught and sent to Sentry from catch block");
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        testType: "error",
        note: "Error should appear in Sentry dashboard within a few seconds",
      },
      { status: 500 }
    );
  }
}

