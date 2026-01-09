import "./globals.css";

import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";
import type React from "react";
import Providers from "./providers";
import { Ga4Analytics } from "@/components/analytics/ga4-analytics";
import { ThemeProvider } from "@/components/theme-provider";

// ViBE Typography
const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ViBE – Virginia Isn't Boring | Event Discovery + Event Pass",
  description: "You must have a ViBE account to attend events. RSVP, check in, and see your Event Pass with attendance history.",
  openGraph: {
    title: "ViBE – Virginia Isn't Boring | Event Discovery + Event Pass",
    description: "You must have a ViBE account to attend events. RSVP, check in, and see your Event Pass with attendance history.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "ViBE",
    images: [
      {
        url: "/images/vibe-logo.png",
        width: 1200,
        height: 630,
        alt: "ViBE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViBE – Virginia Isn't Boring | Event Discovery + Event Pass",
    description: "You must have a ViBE account to attend events. RSVP, check in, and see your Event Pass with attendance history.",
    images: ["/images/vibe-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${openSans.variable} ${montserrat.variable}`}>
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

