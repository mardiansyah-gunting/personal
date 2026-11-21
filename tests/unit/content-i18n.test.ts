import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { getSite } from "@/content";
import { CV } from "@/content/shared";
import type { Seg, Site } from "@/content/types";
import { strings, verbatimSuite } from "./content-suite";

verbatimSuite("id");
verbatimSuite("zh");

const en = getSite("en");
const links = (segs: Seg[]) => segs.filter((s) => typeof s !== "string").map((s) => ({ ...(s as object), text: undefined }));

describe.each(["id", "zh"] as const)("%s mirrors English structure", (lang) => {
  const site: Site = getSite(lang);
  const J: Record<string, string> = JSON.parse(readFileSync(`tests/fixtures/i18n/${lang}.json`, "utf8"));

  test("identity comes from its own i18n file", () => {
    expect(site.lang).toBe(lang);
    expect(site.name).toBe(J["hero.name"]);
    expect(site.role).toBe(J["hero.tagline"].replace(" | ", " · "));
  });

  test("same organisations, projects, experience and photos", () => {
    expect(site.organizations.map((o) => [o.slug, o.href, o.logo])).toEqual(en.organizations.map((o) => [o.slug, o.href, o.logo]));
    expect(site.projects.map((p) => [p.slug, p.cta?.href, p.tags, p.cover])).toEqual(en.projects.map((p) => [p.slug, p.cta?.href, p.tags, p.cover]));
    expect(site.experience.map((e) => [e.slug, e.org, e.logo, e.photos.map((p) => p.src)])).toEqual(
      en.experience.map((e) => [e.slug, e.org, e.logo, e.photos.map((p) => p.src)]),
    );
    expect(site.artifacts.map((a) => [a.ratio, a.visual])).toEqual(
      en.artifacts.map((a, i) => [a.ratio, { ...a.visual, alt: (site.artifacts[i].visual as { alt: string }).alt }]),
    );
  });

  test("same list lengths, contact and social; own CV", () => {
    expect(site.education).toHaveLength(en.education.length);
    expect(site.skills).toHaveLength(en.skills.length);
    expect(site.social).toEqual(en.social);
    expect({ ...site.contact, cv: undefined }).toEqual({ ...en.contact, cv: undefined });
    expect(site.contact.cv).toBe(CV[lang]);
    expect(site.moreProjectsHref).toBe(en.moreProjectsHref);
  });

  test("rich-text links point at the same places", () => {
    expect(links(site.hero)).toEqual(links(en.hero));
    expect(links(site.productsLine)).toEqual(links(en.productsLine));
  });

  test("every UI string is translated", () => {
    const allow = new Set(["GitHub", "LinkedIn", "Email"]);
    const enUi = new Map(strings(en.ui));
    const same = strings(site.ui).filter(([p, v]) => enUi.get(p) === v && !allow.has(v)).map(([p]) => p);
    expect(same).toEqual([]);
  });
});
