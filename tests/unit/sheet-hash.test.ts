import { expect, test } from "vitest";
import { getSite } from "@/content";
import { hashFor, parseHash } from "@/lib/sheet";

const site = getSite("en");

test("project, experience and contact hashes round-trip", () => {
  expect(parseHash("#/work/audio-transkript", site)).toEqual({ type: "project", slug: "audio-transkript" });
  expect(parseHash("#/experience/operations-manager", site)).toEqual({ type: "experience", slug: "operations-manager" });
  expect(parseHash("#/contact", site)).toEqual({ type: "contact" });
  expect(hashFor({ type: "project", slug: "cad-converter" })).toBe("#/work/cad-converter");
  expect(hashFor({ type: "experience", slug: "intern-bps" })).toBe("#/experience/intern-bps");
  expect(hashFor({ type: "contact" })).toBe("#/contact");
});

test("unknown slugs, board links and empty hashes open nothing", () => {
  expect(parseHash("#/work/nope", site)).toBeNull();
  expect(parseHash("#/experience/nope", site)).toBeNull();
  expect(parseHash("#board=abc", site)).toBeNull();
  expect(parseHash("", site)).toBeNull();
});
