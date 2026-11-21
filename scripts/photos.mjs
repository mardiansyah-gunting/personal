// One-off: writes web-sized WebP copies of public/images/jobs/** to public/images/jobs-web/**
// and a dimension manifest to content/photos.json. Originals are left untouched.
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SRC = "public/images/jobs";
const OUT = "public/images/jobs-web";
const IMG = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const manifest = {};
for (const slug of (await readdir(SRC)).sort((a, b) => a.localeCompare(b))) {
  if (!(await stat(join(SRC, slug))).isDirectory()) continue;
  const files = (await readdir(join(SRC, slug)))
    .filter((f) => IMG.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  await mkdir(join(OUT, slug), { recursive: true });
  manifest[slug] = [];
  for (const f of files) {
    const name = `${basename(f, extname(f))}.webp`;
    const info = await sharp(join(SRC, slug, f))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toFile(join(OUT, slug, name));
    manifest[slug].push({ src: `/images/jobs-web/${slug}/${name}`, w: info.width, h: info.height });
  }
}
await writeFile("content/photos.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote ${Object.values(manifest).flat().length} photos`);
