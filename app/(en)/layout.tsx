import type { ReactNode } from "react";
import { Document } from "@/components/Document";
import { metadataFor } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";
export const metadata = metadataFor("en");

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <Document lang="en">{children}</Document>;
}
