import "./globals.css";

import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import type React from "react";
import Providers from "./providers";
import { Ga4Analytics } from "@/components/analytics/ga4-analytics";
import { ThemeProvider } from "@/components/theme-provider";

// Digital Builders Typography
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Digital Builders World – Event Portal + Builder Card",
  description: "You must have a Builder account to attend events. RSVP, check in, and see your Builder Card with XP and badges.",
  openGraph: {
    title: "Digital Builders World – Event Portal + Builder Card",
    description: "You must have a Builder account to attend events. RSVP, check in, and see your Builder Card with XP and badges.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Digital Builders",
    images: [
      {
        url: "/images/digital-builders-logo.png",
        width: 1200,
        height: 630,
        alt: "Digital Builders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Builders World – Event Portal + Builder Card",
    description: "You must have a Builder account to attend events. RSVP, check in, and see your Builder Card with XP and badges.",
    images: ["/images/digital-builders-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="font-body" suppressHydrationWarning>
        <Ga4Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

