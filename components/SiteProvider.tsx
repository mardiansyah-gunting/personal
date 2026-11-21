"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Site } from "@/content/types";

const SiteCtx = createContext<Site | null>(null);

export function SiteProvider({ site, children }: { site: Site; children: ReactNode }) {
  return <SiteCtx.Provider value={site}>{children}</SiteCtx.Provider>;
}

export function useSite(): Site {
  const site = useContext(SiteCtx);
  if (!site) throw new Error("useSite must be used inside <SiteProvider>");
  return site;
}
