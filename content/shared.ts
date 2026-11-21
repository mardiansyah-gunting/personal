/**
 * Language-free data shared by content/{en,id,zh}.ts: links, logos, slugs,
 * tags, photos — plus small builders that join it with translated text.
 */
import { asset } from "@/lib/asset";
import photoManifest from "./photos.json";
import type { Artifact, Education, Experience, Lang, Organization, Photo, Project, SkillRow } from "./types";
import type { Visual } from "./visual";

export const ORGS = [
  { slug: "treeo-indonesia", href: "https://treeo.id/", logo: "treeo.svg" },
  { slug: "fairventures-digital", href: "https://treeo.one/", logo: "fairventures-digital.png" },
  { slug: "fairventures-worldwide", href: "https://www.fairventures.org/", logo: "fairventures-worldwide.jpg" },
  { slug: "karya-hidup-sentosa", href: "https://quick.co.id/", logo: "cv-karya-hidup-sentosa.jpg" },
  { slug: "bps", href: "https://www.bps.go.id/", logo: "bps.png" },
] as const;
export type OrgSlug = (typeof ORGS)[number]["slug"];

const logo = (file: string) => asset(`/images/logos/${file}`);

export function organizations(t: Record<OrgSlug, { name: string; note: string }>): Organization[] {
  return ORGS.map((o) => ({ slug: o.slug, href: o.href, logo: logo(o.logo), ...t[o.slug] }));
}

/** Newest first; index i is `exp.i` in the old i18n files and a folder in public/images/jobs. */
export const EXPERIENCE_SLUGS = [
  "customer-success-manager-2026",
  "operations-manager",
  "customer-success-manager",
  "customer-success-engineer",
  "mobile-developer",
  "hpps-coordinator-assistant",
  "general-affairs-officer",
  "demonstration-officer",
  "intern-bps",
] as const;

const EXPERIENCE_ORG: (OrgSlug | undefined)[] = [
  "treeo-indonesia",
  "fairventures-digital",
  "fairventures-digital",
  "fairventures-digital",
  undefined, // freelance
  "fairventures-worldwide",
  "fairventures-worldwide",
  "karya-hidup-sentosa",
  "bps",
];

const manifest = photoManifest as Record<string, { src: string; w: number; h: number }[]>;

export function photosFor(slug: string, alt: string): Photo[] {
  return (manifest[slug] ?? []).map((p) => ({ ...p, src: asset(p.src), alt }));
}

/** Wraps `phrase` (must occur in `text`) in [[ ]] for the yellow highlight. */
export function highlight(text: string, phrase: string): string {
  if (!text.includes(phrase)) throw new Error(`highlight: "${phrase}" not found in "${text}"`);
  return text.replace(phrase, `[[${phrase}]]`);
}

export function experience(rows: { role: string; company: string; period: string; body: string[] }[]): Experience[] {
  if (rows.length !== EXPERIENCE_SLUGS.length) throw new Error("experience: expected one row per slug");
  return rows.map((r, i) => {
    const org = EXPERIENCE_ORG[i];
    const file = org ? ORGS.find((o) => o.slug === org)!.logo : "konsultan-freelance.svg";
    return { slug: EXPERIENCE_SLUGS[i], org, logo: logo(file), ...r, photos: photosFor(EXPERIENCE_SLUGS[i], `${r.role}, ${r.company}`) };
  });
}

export function toArtifacts(exps: Experience[]): Artifact[] {
  return exps.flatMap((e) =>
    e.photos.map((p) => ({ title: e.role, kind: e.company, visual: { kind: "image" as const, src: p.src, alt: p.alt }, ratio: p.w / p.h })),
  );
}

const PROJECTS = [
  { slug: "workflow-automation", tags: ["Python", "pandas", "openpyxl", "python-dotenv", "schedule", "logging"], cover: { kind: "pipeline" }, gallery: [{ kind: "pipeline" }, { kind: "flow" }] },
  { slug: "treeo-website", tags: ["Web Development", "Animation", "Responsive Design"], cover: { kind: "browser" }, gallery: [{ kind: "browser" }, { kind: "phone", label: "TREEO" }], website: "https://treeo.id" },
  { slug: "audio-transkript", tags: ["Python", "SpeechRecognition", "pydub", "python-docx"], cover: { kind: "transcript" }, gallery: [{ kind: "transcript" }, { kind: "notebook" }], github: "https://github.com/mardiansyah-gunting/audio_transkript" },
  { slug: "cad-converter", tags: ["Python", "GDAL", "GeoPandas", "GIS"], cover: { kind: "darkapp" }, gallery: [{ kind: "darkapp" }, { kind: "map" }], github: "https://github.com/mardiansyah-gunting/CAD-converter" },
] as const satisfies readonly {
  slug: string; tags: readonly string[]; cover: Visual; gallery: readonly Visual[];
  website?: string; github?: string;
}[];
export type ProjectSlug = (typeof PROJECTS)[number]["slug"];

export function projects(
  t: Record<ProjectSlug, { title: string; kind: string; summary: string; captions: string[] }>,
  labels: { github: string; website: string },
): Project[] {
  return PROJECTS.map((p) => {
    const tr = t[p.slug];
    if (tr.captions.length !== p.gallery.length) throw new Error(`projects: ${p.slug} needs ${p.gallery.length} captions`);
    const cta = "github" in p ? { label: labels.github, href: p.github } : "website" in p ? { label: labels.website, href: p.website } : undefined;
    return {
      slug: p.slug,
      title: tr.title,
      kind: tr.kind,
      cover: p.cover,
      summary: tr.summary,
      body: [],
      tags: [...p.tags],
      cta,
      gallery: p.gallery.map((visual, i) => ({ visual, caption: tr.captions[i] })),
    };
  });
}

export const MORE_PROJECTS = "https://github.com/mardiansyah-gunting?tab=repositories";

const SKILL_TAGS = [
  ["Python", "Kotlin", "Java", "Android Development", "Android Studio", "Debugging & Troubleshooting", "Scripting & Automation", "Data Pipeline & Processing", "Database & Data Validation"],
  ["Communication", "Client Onboarding", "Customer Relationship Management", "Field Visits & Feedback", "User Training & Documentation", "Product & Process Improvement", "B2B Communication", "Technical Support"],
  ["Project Management", "Operations Management", "Partner Relationship Management", "Program Planning & Scheduling", "Stakeholder Coordination", "Data Quality & Reporting", "Time Management", "Team Leadership"],
  ["Field Research", "Data Collection & Processing", "Statistical Data Processing", "Data Management", "Agroforestry & Reforestation", "Safety Compliance", "Project Reporting"],
  ["Logistics Management", "Procurement", "Contract & Office Administration", "Asset Management", "Facility Management", "Office Operations Coordination"],
];

const STRENGTHS = [
  { key: "communication", count: 7 },
  { key: "fieldops", count: 4 },
  { key: "datamonitoring", count: 4 },
  { key: "training", count: 3 },
  { key: "uiux", count: 3 },
  { key: "opsmgmt", count: 3 },
] as const;
export type StrengthKey = (typeof STRENGTHS)[number]["key"];
export const TOTAL_ROLES = 9;

export function skills(
  groupTitles: [string, string, string, string, string],
  languages: { title: string; items: string[] },
  strengths: { title: string; labels: Record<StrengthKey, string>; of: (count: number, total: number) => string },
): SkillRow[] {
  return [
    ...groupTitles.map((title, i) => ({ title, text: SKILL_TAGS[i].join(" · ") })),
    { title: languages.title, text: languages.items.join(" · ") },
    { title: strengths.title, text: STRENGTHS.map((s) => `${strengths.labels[s.key]} — ${strengths.of(s.count, TOTAL_ROLES)}`).join(" · ") },
  ];
}

export function education(rows: Education[]): Education[] {
  return rows;
}

export const CV: Record<Lang, string> = {
  en: "https://ap.wps.com/cms/docs/d/cbPaes8mwZdX9lII",
  id: "https://ap.wps.com/cms/docs/d/cbPaeocVk7PaNV6q",
  zh: "https://ap.wps.com/cms/docs/d/cbPaedq51hh7xth3",
};

export function contact(lang: Lang) {
  return {
    email: "mardiansyah.gunting@yahoo.com",
    phone: "+6287897434336",
    cv: CV[lang],
    endpoint: "https://formsubmit.co/ajax/mardiansyah.gunting@yahoo.com",
  };
}

export const SOCIAL = [
  { label: "LinkedIn", href: "https://linkedin.com/in/mardiansyah-gunting", icon: "linkedin" as const },
  { label: "GitHub", href: "https://github.com/mardiansyah-gunting", icon: "github" as const },
];
