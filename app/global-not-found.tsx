import "@fontsource/kalam/400.css";
import "./globals.css";
import type { Metadata } from "next";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Not found — Mardiansyah Gunting" };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="content-width grid min-h-[100svh] place-content-center gap-4 text-center">
          <h1 className="text-[30px] leading-tight">This page wandered off.</h1>
          <a href={asset("/")} className="hand-link justify-self-center text-muted">
            Back to the portfolio
          </a>
        </main>
      </body>
    </html>
  );
}
