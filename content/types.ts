import type { Visual } from "./visual";

export type { Visual };
export type Lang = "en" | "id" | "zh";

/** Rich text: a plain string, or a link that gets the hand-drawn underline. */
export type Seg = string | { text: string; href?: string; project?: string; experience?: string };

export type Photo = { src: string; w: number; h: number; alt: string };
export type Organization = { slug: string; name: string; note: string; href: string; logo: string };
export type Project = {
  slug: string;
  title: string;
  kind: string;
  portrait?: boolean;
  cover: Visual;
  summary: string;
  body: string[];
  tags: string[];
  cta?: { label: string; href: string };
  confidential?: string;
  gallery: { visual: Visual; caption: string }[];
};
export type SkillRow = { title: string; text: string };
/** `org` is an Organization.slug; body paragraphs may wrap one phrase in [[double brackets]] to highlight it. */
export type Experience = { slug: string; role: string; company: string; org?: string; period: string; logo: string; body: string[]; photos: Photo[] };
export type Education = { school: string; programme: string; period: string; grade?: string };
export type Artifact = { title: string; kind: string; visual: Visual; ratio: number };

export type UiStrings = {
  sections: Record<"now" | "organizations" | "projects" | "skills" | "experience" | "education" | "gallery", string>;
  readMore: string;
  visitSite: string;
  opensNewTab: string;
  galleryHint: string;
  close: string;
  previous: string;
  next: string;
  copied: string;
  downloadCv: string;
  sendMessage: string;
  emailLabel: string;
  phoneLabel: string;
  referencesTitle: string;
  rights: string;
  press: string;
  language: string;
  moreProjects: string;
  form: Record<"title" | "name" | "email" | "message" | "send" | "incomplete" | "sending" | "sent" | "error", string>;
  board: Record<
    | "tools" | "move" | "draw" | "note" | "original" | "fall" | "zoom" | "link" | "text" | "reset" | "done"
    | "welcome" | "shared" | "nothingUndo" | "nothingFall" | "linkCopied" | "clipboardFail" | "textCopied" | "resetDone"
    | "notePlaceholder" | "noteDelete" | "noteLabel" | "notesHeading",
    string
  >;
};

export type Site = {
  lang: Lang;
  meta: { title: string; description: string };
  name: string;
  role: string;
  status: { label: string; note: string };
  hero: Seg[];
  now: { lead: string; company: string; rest: string; about: string[] };
  organizations: Organization[];
  productsLine: Seg[];
  projects: Project[];
  moreProjectsHref: string;
  skills: SkillRow[];
  experience: Experience[];
  education: Education[];
  artifacts: Artifact[];
  contact: { email: string; phone: string; cv: string; endpoint: string; references: { name: string; phone: string }[] };
  social: { label: string; href: string; icon: "linkedin" | "github" }[];
  ui: UiStrings;
};
