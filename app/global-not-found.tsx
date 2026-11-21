import type { Metadata } from "next";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Mardiansyah Gunting", robots: { index: false } };

/** Unknown URLs go straight to the portfolio home page. */
export default function GlobalNotFound() {
  const home = asset("/");
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0;url=${home}`} />
        <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(home)})` }} />
      </head>
      <body />
    </html>
  );
}
