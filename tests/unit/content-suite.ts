import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { getSite } from "@/content";
import { ORGS } from "@/content/shared";
import type { Seg, Site } from "@/content/types";

const photos: Record<string, unknown[]> = JSON.parse(readFileSync("content/photos.json", "utf8"));
const totalPhotos = Object.values(photos).flat().length;

/** Every string reachable from `v` (deep walk). */
export function strings(v: unknown, path = "site"): [string, string][] {
  if (typeof v === "string") return [[path, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => strings(x, `${path}[${i}]`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => strings(x, `${path}.${k}`));
  return [];
}

const linkTargets = (segs: Seg[]) => segs.filter((s): s is Exclude<Seg, string> => typeof s !== "string");

export function verbatimSuite(lang: "en" | "id" | "zh") {
  const J: Record<string, string> = JSON.parse(readFileSync(`tests/fixtures/i18n/${lang}.json`, "utf8"));
  const site: Site = getSite(lang);

  describe(`${lang}: content stays the user's`, () => {
    test("experience role, company, period are verbatim", () => {
      expect(site.experience).toHaveLength(8);
      site.experience.forEach((e, i) => {
        expect(e.role).toBe(J[`exp.${i}.role`]);
        expect(e.company).toBe(J[`exp.${i}.company`]);
        expect(e.period).toBe(J[`exp.${i}.period`]);
      });
    });

    test("experience body is the description plus one highlight", () => {
      site.experience.forEach((e, i) => {
        expect(e.body.join("\n").replace(/\[\[|\]\]/g, "")).toBe(J[`exp.${i}.desc`]);
        expect(e.body.join("\n").match(/\[\[[^\]]+\]\]/g), e.slug).toHaveLength(1);
      });
    });

    test("experience photos match the manifest", () => {
      site.experience.forEach((e) => expect(e.photos.length, e.slug).toBe(photos[e.slug].length));
    });

    test("education is verbatim", () => {
      expect(site.education).toHaveLength(4);
      site.education.forEach((ed, i) => {
        expect(ed.school).toBe(J[`edu.${i}.school`]);
        expect(ed.programme).toBe(J[`edu.${i}.major`]);
        expect(ed.period).toBe(J[`edu.${i}.period`]);
        expect(ed.grade).toBe(J[`edu.${i}.grade`]);
      });
    });

    test("skills: five groups verbatim, then languages and strengths", () => {
      expect(site.skills).toHaveLength(7);
      expect(site.skills.slice(0, 5).map((s) => s.title)).toEqual(
        ["eng", "css", "ops", "field", "log"].map((k) => J[`skills.cat.${k}`]),
      );
      expect(site.skills[5].title).toBe(J["skills.languages"]);
      expect(site.skills[6].title).toBe(J["skills.chart_title"]);
    });

    test("projects keep their titles and order", () => {
      expect(site.projects.map((p) => p.slug)).toEqual([
        "workflow-automation", "treeo-website", "audio-transkript", "cad-converter",
      ]);
      const titles = [J["projects.automation.title"], J["projects.1.title"], "Audio Transkript", J["projects.4.title"]];
      expect(site.projects.map((p) => p.title)).toEqual(titles);
      site.projects.forEach((p) => expect(p.gallery.length, p.slug).toBeGreaterThan(0));
    });

    test("organisations link to the official sites, in order", () => {
      expect(site.organizations.map((o) => o.href)).toEqual(ORGS.map((o) => o.href));
      site.organizations.forEach((o) => expect(o.href).toMatch(/^https:\/\//));
    });

    test("rich-text links point at things that exist", () => {
      for (const s of linkTargets([...site.hero, ...site.productsLine])) {
        if (s.project) expect(site.projects.some((p) => p.slug === s.project), s.project).toBe(true);
        if (s.experience) expect(site.experience.some((e) => e.slug === s.experience), s.experience).toBe(true);
      }
    });

    test("gallery has one artifact per photo", () => {
      expect(site.artifacts).toHaveLength(totalPhotos);
    });

    test("no empty strings anywhere", () => {
      expect(strings(site).filter(([, v]) => v.trim() === "").map(([p]) => p)).toEqual([]);
    });
  });
}
