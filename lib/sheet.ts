import type { Site } from "@/content/types";

/** What a detail sheet shows; each one is deep-linkable through the URL hash. */
export type SheetTarget = { type: "project"; slug: string } | { type: "experience"; slug: string } | { type: "contact" };

export function hashFor(t: SheetTarget): string {
  if (t.type === "contact") return "#/contact";
  return `#/${t.type === "project" ? "work" : "experience"}/${t.slug}`;
}

export function parseHash(hash: string, site: Site): SheetTarget | null {
  if (hash === "#/contact") return { type: "contact" };
  const m = hash.match(/^#\/(work|experience)\/([\w-]+)$/);
  if (!m) return null;
  const slug = m[2];
  if (m[1] === "work") return site.projects.some((p) => p.slug === slug) ? { type: "project", slug } : null;
  return site.experience.some((e) => e.slug === slug) ? { type: "experience", slug } : null;
}
