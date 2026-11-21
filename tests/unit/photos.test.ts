import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { expect, test } from "vitest";

const SRC = "public/images/jobs";
const IMG = new Set([".jpg", ".jpeg", ".png", ".webp"]);
type Entry = { src: string; w: number; h: number };

const loadManifest = (): Record<string, Entry[]> => JSON.parse(readFileSync("content/photos.json", "utf8"));
const folders = readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isDirectory());

test("manifest has one web photo per source photo, per folder", () => {
  const manifest = loadManifest();
  for (const slug of folders) {
    const sources = readdirSync(join(SRC, slug)).filter((f) => IMG.has(extname(f).toLowerCase()));
    expect(manifest[slug]?.length, slug).toBe(sources.length);
  }
});

test("every web photo exists, has a size, is small and at most 1600px", () => {
  for (const entries of Object.values(loadManifest())) {
    for (const e of entries) {
      const file = join("public", e.src);
      expect(existsSync(file), e.src).toBe(true);
      expect(e.w).toBeGreaterThan(0);
      expect(e.h).toBeGreaterThan(0);
      expect(Math.max(e.w, e.h)).toBeLessThanOrEqual(1600);
      expect(statSync(file).size, e.src).toBeLessThan(400 * 1024);
    }
  }
});
