import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "@fontsource/mrs-saint-delafield/400.css";
import "./globals.css";
import { site } from "@/content/site";
import { handLine } from "@/lib/handLine";

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
  metadataBase: new URL(site.meta.url),
  openGraph: { title: site.meta.title, description: site.meta.description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ ["--hand-line" as string]: handLine() } as CSSProperties}>
      <body>{children}</body>
    </html>
  );
}
