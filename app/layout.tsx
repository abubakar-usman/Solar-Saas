// ============================================================
// FILE 19 — app/layout.tsx  (REPLACES existing layout.tsx)
// Place at: app/layout.tsx
// ============================================================

import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "SolarPro Pakistan — Solar Installation Management",
  description:
    "Pakistan's trusted solar panel installation SaaS. Manage projects, site surveys, net metering and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
