# Folio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Astro portfolio with the folio template's Next.js design (everything in handwriting), filled with Mardiansyah's existing EN/ID/ZH content, exported statically to GitHub Pages under `/personal`.

**Architecture:** The template's React components are copied in and adapted. Content is plain typed data: `content/shared.ts` (links, logos, slugs, photos) plus one `Site` object per language (`content/{en,id,zh}.ts`). A server page per language passes its `Site` to a client `SiteProvider`. Components read `useSite()`. Two route groups give `/` (EN) and `/[lang]` (ID, ZH), each with its own root layout so `<html lang>` is right in the static HTML.

**Tech Stack:** Next.js 16.4.6 (static export), React 19.3.1, Tailwind 4.3.5, TypeScript 5.9.3, `@fontsource/kalam`, `@fontsource/mrs-saint-delafield`, `lxgw-wenkai-screen-webfont`, Vitest (unit), Playwright (e2e on the built `out/`), sharp (one-off photo script).

**Spec:** `docs/superpowers/specs/2026-11-21-folio-redesign-design.md`. Template source (read-only reference): unzip `~/Downloads/folio-template.zip` into a scratch dir; paths below like `T/components/Hero.tsx` mean that template's file.

## Global Constraints

- Base path `/personal`; absolute site URL `https://mardiansyah-gunting.github.io/personal`. `next.config.mjs`: `output: "export"`, `basePath: "/personal"`, `trailingSlash: true`, `images: { unoptimized: true }`, `env: { NEXT_PUBLIC_BASE_PATH: "/personal" }`.
- Every public asset URL (`/images/…`, `/profile.jpg`, favicons) goes through `asset()` from `lib/asset.ts`. Content files apply it; components never hard-code `/personal`.
- Only server components (`components/HomePage.tsx`, the layouts) import `content/index.ts`. Client components get content via `useSite()` and import content modules with `import type` only.
- Exact versions: next 16.4.6 · react / react-dom 19.3.1 · tailwindcss and @tailwindcss/postcss 4.3.5 · typescript 5.9.3 · @types/node 22.20.5 · @types/react 19.3.0 · @types/react-dom 19.3.0 · @fontsource/kalam 5.3.0 · @fontsource/mrs-saint-delafield 5.3.0 · lxgw-wenkai-screen-webfont 1.7.0 · vitest 5.1.1 · @playwright/test 1.63.0 · sharp 0.35.5.
- CI Node 22; local Node 26.
- Fonts: `--font-sans: "Kalam", "LXGW WenKai Screen", "Kaiti SC", "STKaiti", "KaiTi", cursive;` and `--font-sign: "Mrs Saint Delafield", cursive;`. Body text 18px, line-height 1.5, weight 400, letter-spacing normal. The footer signature always shows the Latin name "Mardiansyah Gunting" (the signature face has no CJK).
- Type scale when porting a template class: 12px→14px · 13px→15px · 14px→16px · 15px→18px · 16px→18px · 20px→22px · 21/24px (statement) →26px mobile / 30px ≥640px · sheet titles 24px→30px. Drop every negative `tracking-[…]` class.
- Colour tokens stay exactly as in `T/app/globals.css` (`:root` and `:root.is-inverted`).
- Copy: wording comes from `tests/fixtures/i18n/{en,id,zh}.json` (moved there from `public/i18n/` in Task 1). Role, company, period, project title, school, programme, period, grade and skill-group titles are verbatim. A job description is verbatim apart from added `[[ ]]` highlight markers and splitting at its `\n`. No project years. No invented numbers, names or quotes. ID keeps the Indonesian tagline from `id.json`.
- External links: `target="_blank" rel="noopener noreferrer"`.
- Git: commit on `dev` after each task. Never push to any remote.
- Tests never submit the real contact form: every e2e test that submits it intercepts `https://formsubmit.co/**` with `page.route`.
- Motion respects `prefers-reduced-motion`. Everything works by keyboard, with visible focus.

## Review Focus

1. **Assets under `/personal`:** fonts, `_next` chunks, images and CSS `url()` must load on all three language pages. No response may be ≥ 400, and no request may fail. Test: Task 1 `e2e/smoke.spec.ts`, extended to all languages in Task 5.
2. **A saved language plus a deep link:** a visitor whose saved `lang` is `id` opens `/personal/#/work/tree-monitoring`. They should land on `/personal/id/#/work/tree-monitoring` with the Indonesian sheet open. Test: Task 6 `e2e/projects.spec.ts`.
3. **Keyboard:** Tab to a rail card, Enter opens the sheet, Esc closes it, and focus returns to the card. Test: Task 6 `e2e/projects.spec.ts`.
4. **Long ID/ZH strings at 375px** (org names, "HPPS Project Coordinator Assistant"): they wrap, and the page never scrolls sideways. Test: Task 12 `e2e/layout.spec.ts`.
5. **Readable without JavaScript** (a slow or blocked bundle): name, hero sentence and organisation links are visible in the static HTML. Test: Task 7 `e2e/intro.spec.ts`.

---

### Task 1: Next.js scaffold replaces Astro

**Files:**
- Delete: `src/`, `astro.config.mjs`
- Move: `public/i18n/` → `tests/fixtures/i18n/` (`git mv`)
- Copy from template unchanged for now: `T/app/{layout.tsx,page.tsx,globals.css}`, `T/components/**`, `T/lib/handLine.ts`, `T/content/site.ts` (legacy placeholder content; removed in Task 11), `T/postcss.config.mjs`, `T/tsconfig.json`
- Create: `next.config.mjs`, `lib/asset.ts`, `vitest.config.ts`, `tests/unit/asset.test.ts`, `playwright.config.ts`, `scripts/serve-out.mjs`, `e2e/smoke.spec.ts`
- Modify: `package.json`, `.gitignore` (add `.next/`, `out/`, `test-results/`, `playwright-report/`, `next-env.d.ts`), `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: `asset(path: string): string`, which prefixes `process.env.NEXT_PUBLIC_BASE_PATH ?? ""` and throws `Error("asset path must start with /")` otherwise. Also produces the npm scripts `build`, `test` (`vitest run`), `test:e2e` (`playwright test`) and `photos` (`node scripts/photos.mjs`), plus the e2e server at `http://localhost:4321/personal/`.

- [ ] **Step 1: Write the failing test** `tests/unit/asset.test.ts`

```ts
import { afterEach, expect, test, vi } from "vitest";
import { asset } from "@/lib/asset";
afterEach(() => vi.unstubAllEnvs());
test("prefixes base path", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/personal");
  expect(asset("/images/logos/bps.png")).toBe("/personal/images/logos/bps.png");
});
test("no base path in tests by default", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  expect(asset("/profile.jpg")).toBe("/profile.jpg");
});
test("rejects relative paths", () => expect(() => asset("images/x.png")).toThrow("asset path must start with /"));
```

- [ ] **Step 2: Set up package.json, vitest, and copy the template.** Use the Global Constraints versions and drop `astro` and `@fontsource-variable/inter-tight`. Delete the `@fontsource-variable/inter-tight` import from the copied `app/layout.tsx`, or the build breaks. `vitest.config.ts` uses `environment: "node"`, `include: ["tests/unit/**/*.test.ts"]` and alias `@` → repo root. Run `npm install`.
- [ ] **Step 3: Run the test to verify it fails.** `npx vitest run tests/unit/asset.test.ts`. Expected: FAIL, cannot resolve `@/lib/asset`.
- [ ] **Step 4: Implement `lib/asset.ts`.** Run `npm test`. Expected: 3 passed.
- [ ] **Step 5: Add the e2e harness.**
  - `scripts/serve-out.mjs`: a `node:http` server on port 4321. It serves `out/` at `/personal/`, redirects `/` → `/personal/`, serves `index.html` for directory paths, and returns `out/404.html` with status 404. Content types cover html, js, css, woff, woff2, webp, png, jpg, jpeg, svg, json, ico, txt, xml.
  - `playwright.config.ts`: `webServer { command: "node scripts/serve-out.mjs", url: "http://localhost:4321/personal/", reuseExistingServer: true }`, `use.baseURL: "http://localhost:4321"`, one `chromium` project.
- [ ] **Step 6: Write `e2e/smoke.spec.ts`.** Test `"home has no failed requests"`: record `requestfailed` and responses with status ≥ 400, `goto("/personal/")`, wait for `networkidle`, then expect the title to match `/.+/` and the failures list to equal `[]`.
- [ ] **Step 7: Build and run.** `npm run build && npm run test:e2e`. Expected: `out/index.html` exists and the smoke test passes. If the cached browser does not match, run `npx playwright install chromium` once.
- [ ] **Step 8: Update the deploy workflow.** `node-version: 22` and upload `path: out`.
- [ ] **Step 9: Commit.** `git add -A && git commit -m "build: replace Astro with folio Next.js scaffold (static export at /personal)"`

### Task 2: Web-sized job photos and manifest

**Files:**
- Create: `scripts/photos.mjs`, `tests/unit/photos.test.ts`
- Generated and committed: `public/images/jobs-web/<slug>/*.webp`, `content/photos.json`

**Interfaces:**
- Produces: `content/photos.json` of shape `Record<string /* folder slug */, { src: string /* "/images/jobs-web/<slug>/<name>.webp", no base path */; w: number; h: number }[]>`. Entries are ordered by source filename with `localeCompare`, the same order the old site used.

- [ ] **Step 1: Write the failing test.** For every folder in `public/images/jobs/`, the manifest has that key with one entry per source image (extensions jpg, jpeg, png, webp). Every `src` exists under `public/`, every `w` and `h` is > 0, every file is < 400 KB, and `Math.max(w, h) <= 1600`.
- [ ] **Step 2: Run it.** `npx vitest run tests/unit/photos.test.ts`. Expected: FAIL, `content/photos.json` is missing.
- [ ] **Step 3: Implement `scripts/photos.mjs`.** sharp `.rotate()` (apply EXIF), then `.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })`, then `.webp({ quality: 78 })`. Output name = source basename with a `.webp` extension. Read `w` and `h` from the output metadata. Write pretty JSON. Originals stay untouched.
- [ ] **Step 4: Run** `npm run photos && npm test`. Expected: all pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(photos): web-sized job photos with dimension manifest"`

### Task 3: Content model, shared data, English site

**Files:**
- Create: `content/types.ts`, `content/shared.ts`, `content/en.ts`, `content/index.ts`, `tests/unit/content.test.ts`

**Interfaces:**
- Produces `content/types.ts`. It is the contract for every later task:

```ts
import type { Visual } from "./visual"; // move the template's Visual union here verbatim as content/visual.ts
export type Lang = "en" | "id" | "zh";
export type Seg = string | { text: string; href?: string; project?: string; experience?: string };
export type Photo = { src: string; w: number; h: number; alt: string };
export type Organization = { slug: string; name: string; note: string; href: string; logo: string };
export type Project = {
  slug: string; title: string; kind: string; portrait?: boolean; cover: Visual;
  summary: string; body: string[]; tags: string[];
  cta?: { label: string; href: string }; confidential?: string;
  gallery: { visual: Visual; caption: string }[];
};
export type SkillRow = { title: string; text: string };
export type Experience = { slug: string; role: string; company: string; org?: string; period: string; logo: string; body: string[]; photos: Photo[] };
export type Education = { school: string; programme: string; period: string; grade?: string };
export type Artifact = { title: string; kind: string; visual: Visual; ratio: number };
export type UiStrings = {
  sections: Record<"now" | "organizations" | "projects" | "skills" | "experience" | "education" | "gallery", string>;
  readMore: string; visitSite: string; opensNewTab: string; galleryHint: string; close: string; previous: string; next: string;
  copied: string; downloadCv: string; sendMessage: string; emailLabel: string; phoneLabel: string; referencesTitle: string;
  rights: string; press: string; language: string; moreProjects: string;
  form: Record<"title" | "name" | "email" | "message" | "send" | "incomplete" | "sending" | "sent" | "error", string>;
  board: Record<"tools" | "move" | "draw" | "note" | "original" | "fall" | "zoom" | "link" | "text" | "reset" | "done" | "welcome" | "shared" | "nothingUndo" | "nothingFall" | "linkCopied" | "clipboardFail" | "textCopied" | "resetDone" | "notePlaceholder" | "noteDelete" | "noteLabel" | "notesHeading", string>;
};
export type Site = {
  lang: Lang; meta: { title: string; description: string };
  name: string; role: string; status: { label: string; note: string };
  hero: Seg[]; now: { lead: string; company: string; rest: string; about: string[] };
  organizations: Organization[]; productsLine: Seg[];
  projects: Project[]; moreProjectsHref: string;
  skills: SkillRow[]; experience: Experience[]; education: Education[]; artifacts: Artifact[];
  contact: { email: string; phone: string; cv: string; endpoint: string; references: { name: string; phone: string }[] };
  social: { label: string; href: string; icon: "linkedin" | "github" }[];
  ui: UiStrings;
};
```

- Produces `content/shared.ts`, holding the language-free constants that every language file imports:
  - `ORGS: { slug, href, logo }[]`, in this order:
    - `treeo-indonesia` → `https://treeo.id/`, `treeo.svg`
    - `fairventures-digital` → `https://treeo.one/`, `fairventures-digital.png`
    - `fairventures-worldwide` → `https://www.fairventures.org/`, `fairventures-worldwide.jpg`
    - `karya-hidup-sentosa` → `https://quick.co.id/`, `cv-karya-hidup-sentosa.jpg`
    - `bps` → `https://www.bps.go.id/`, `bps.png`
    - Logo paths go through `asset("/images/logos/…")`.
  - `EXPERIENCE_SLUGS`, newest first. Index i maps to JSON `exp.i`: `customer-success-manager-2026, operations-manager, customer-success-manager, customer-success-engineer, mobile-developer, hpps-coordinator-assistant, general-affairs-officer, demonstration-officer, intern-bps`.
  - `EXPERIENCE_ORG`, mapping index → org slug: `0→treeo-indonesia, 1–3→fairventures-digital, 5–6→fairventures-worldwide, 7→karya-hidup-sentosa, 8→bps`. Index 4 has none and uses logo `konsultan-freelance.svg`.
  - `photosFor(slug: string, alt: string): Photo[]`: reads `photos.json` and applies `asset()`.
  - `toArtifacts(exps: Experience[]): Artifact[]`: one per photo, `{ title: role, kind: company, visual: { kind: "image", src, alt }, ratio: w / h }`.
  - `PROJECTS`, the data parts:
    - `akar-dmrv`: tags Flutter, JavaScript, C++; confidential.
    - `treeo-website`: tags Web Development, Animation, Responsive Design; CTA href `https://treeo.id`.
    - `workflow-automation`: Python tags from the old "Built with" list in `git show 1168004:src/components/Projects.astro`; cover `{ kind: "image", src: asset("/images/automation-flow.png"), fit: "contain" }`; confidential.
    - `tree-monitoring`: `portrait: true`; tags Kotlin, Jetpack Compose, Material 3, GPS; GitHub `https://github.com/mardiansyah-gunting/tree-monitoring`.
    - `cad-converter`: tags Python, GDAL, GeoPandas, GIS; GitHub `https://github.com/mardiansyah-gunting/CAD-converter`.
    - `techmentoring`: tags Python, Mentoring, Teaching; GitHub `https://github.com/mardiansyah-gunting/TechMentoring`.
  - `MORE_PROJECTS = "https://github.com/mardiansyah-gunting?tab=repositories"`.
  - `CONTACT = { email: "mardiansyah.gunting@yahoo.com", phone: "+6287897434336", endpoint: "https://formsubmit.co/ajax/mardiansyah.gunting@yahoo.com" }`.
  - `CV`, the WPS links per language from `git show 1168004:src/components/Hero.astro`.
  - `REF_PHONES = ["+491733713510", "+61450961522"]`.
  - `SOCIAL`: LinkedIn `https://linkedin.com/in/mardiansyah-gunting`, GitHub `https://github.com/mardiansyah-gunting`.
  - `SKILL_TAGS`: the five groups' tag arrays from the old `Skills.astro`.
  - `STRENGTHS = [{key:"communication",count:7},{key:"fieldops",count:4},{key:"datamonitoring",count:4},{key:"training",count:3},{key:"uiux",count:3},{key:"opsmgmt",count:3}]` and `TOTAL_ROLES = 9`.
- Produces `content/index.ts`: `export function getSite(lang: Lang): Site`. Until Task 4 it maps only `en`.

- [ ] **Step 1: Write the failing tests** (`tests/unit/content.test.ts`). Load `tests/fixtures/i18n/en.json` as `J`.
  - `experience[i].role/company/period === J["exp.i.role"/"company"/"period"]` for i in 0..8.
  - `experience[i].body.join("\n").replace(/\[\[|\]\]/g, "") === J["exp.i.desc"]`, and each experience has exactly one `[[…]]` pair.
  - `experience[i].photos.length === photos.json[slug].length`.
  - `organizations.map(o => o.href)` equals the five `ORGS` hrefs in order. Every href starts with `https://`.
  - Every project or experience slug referenced in `hero` or `productsLine` exists.
  - `education[i]` school / programme / period / grade equal `edu.i.*`.
  - `skills.length === 7`. The first five titles equal `skills.cat.{eng,css,ops,field,log}`.
  - `projects` slugs equal `["akar-dmrv","treeo-website","workflow-automation","tree-monitoring","cad-converter","techmentoring"]` and every project has ≥ 1 gallery item.
  - `artifacts.length` = total photo count.
  - No string anywhere in the site object is empty (deep walk).
- [ ] **Step 2: Run them.** Expected: FAIL, modules are missing.
- [ ] **Step 3: Implement `content/visual.ts`, `types.ts`, `shared.ts`, `en.ts`, `index.ts`.** EN copy that the spec fixes in substance:
  - `role` = `hero.tagline` with the `|` turned into `·`.
  - `status` = `{ label: "Open to work", note: "Open to new roles and collaborations" }`.
  - `hero` = `["I work where operations, technology and strategy meet — bridging teams, building ", {text:"the tools they need", href:"#projects"}, ", and clearing away the repetitive work that quietly slows a business down. Today I do that at ", {text:"TREEO Indonesia", href:"#organizations"}, "."]`.
  - `now.lead` = `"Right now I'm Technology & Customer Success Manager at"`, `now.company` = `"TREEO"`, `now.rest` = a one-line version of `exp.0.desc`, `now.about` = `[about.p1, about.p2]` lightly trimmed.
  - `productsLine` is condensed from `projects.intro`: `"Along the way I build my own tools, often with AI in the loop: "` + project segs for Workflow Automation, Tree Monitoring, CAD Converter and TechMentoring.
  - Org notes are `"<years> · <role>"`, years as in the spec table.
  - `meta.description` (~155 chars) is built from `hero.tagline` + `hero.subtitle` + `about.lead`.
  - Skills rows 6 and 7: "Languages" (the three `skills.lang.*`), and `skills.chart_title`, whose text lists each `skills.bar.<key>.label` with "N of 9 roles".
  - Project `kind`s: `"Internal · Flutter"`, `"Website"`, `"Internal · Python"`, `"Android app"`, `"Python tool"`, `"Mentoring"`.
  - Project `summary` = `projects.<n>.desc` (for workflow-automation, `projects.automation.desc`). `body` = `[]` for every project: the sheet shows summary, tags, CTA or confidential note, and gallery.
  - `confidential` = `projects.private_note`.
  - Covers: `akar-dmrv` → `chart`, `treeo-website` → `browser`, `tree-monitoring` → `phone`, `cad-converter` → `darkapp`, `techmentoring` → `specimen`.
  - Every `Photo.alt` = `"<role>, <company>"`.
- [ ] **Step 4: Run** `npm test`. Expected: all pass. The site still renders legacy content, so the build is unaffected.
- [ ] **Step 5: Commit.** `git commit -m "feat(content): typed site model, shared data, English content"`

### Task 4: Indonesian and Chinese content

**Files:**
- Create: `content/id.ts`, `content/zh.ts`, `tests/unit/content-i18n.test.ts`
- Modify: `content/index.ts` (map all three)

**Interfaces:**
- Consumes: the `Site` type and `shared.ts` from Task 3.
- Produces: `getSite("id")` and `getSite("zh")`.

- [ ] **Step 1: Write the failing tests.**
  - Parametrise the Task 3 verbatim checks over `id`/`zh` against their own JSON fixture. ID `role` is `"Operator Andal · Pembangun Automasi"`. ZH `name` is `zh.json["hero.name"]`.
  - Parity with EN: identical lists of org slugs and hrefs, project slugs and CTA hrefs, experience slugs and photo srcs, the same `education` / `skills` / `artifacts` lengths, the same `social` and `contact` except `cv`, `cv === CV[lang]`, and the same Seg link targets in `hero` / `productsLine`.
  - No empty strings.
  - No `UiStrings` value is identical to the EN value, except an allow-list of brand words: `"GitHub"`, `"LinkedIn"`, `"Email"`.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Write `id.ts` and `zh.ts`.** Verbatim fields come from their JSON. Translate new or shortened sentences in the same register: ID uses natural professional "saya" (as in the docx revision), ZH uses simplified Chinese.
- [ ] **Step 4: Run** `npm test`. Expected: all pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(content): Indonesian and Chinese content"`

### Task 5: Handwritten type, language routes, metadata, SiteProvider

**Files:**
- Delete: `app/layout.tsx`, `app/page.tsx`
- Create:
  - `app/(en)/layout.tsx`, `app/(en)/page.tsx`
  - `app/(intl)/[lang]/layout.tsx`, `app/(intl)/[lang]/page.tsx`
  - `app/global-not-found.tsx`
  - `components/Document.tsx`, `components/HomePage.tsx`, `components/SiteProvider.tsx`, `components/LangSwitch.tsx`
  - `lib/lang.ts`, `tests/unit/lang.test.ts`, `e2e/i18n.spec.ts`
- Modify: `app/globals.css` (fonts per Global Constraints), `e2e/smoke.spec.ts` (loop over the three paths), `public/sitemap.xml` (three URLs), `next.config.mjs` (add `experimental.globalNotFound: true` only if `next build` asks for it)

**Interfaces:**
- Consumes: `getSite(lang)` and `asset()`.
- Produces:
  - `lib/lang.ts`:
    - `LANGS = ["en","id","zh"] as const`
    - `pathFor(lang: Lang): "/" | "/id/" | "/zh/"`
    - `hrefFor(lang: Lang): string`, which is `asset(pathFor(lang))`
    - `SITE_URL = "https://mardiansyah-gunting.github.io/personal"`
    - `LANG_LABEL: Record<Lang,string> = { en: "EN", id: "ID", zh: "中文" }`
    - `REDIRECT_SCRIPT: string`, an inline script for the EN page only. If `localStorage.lang` is `id` or `zh` and the pathname is exactly `/personal/`, it calls `location.replace("/personal/<lang>/" + location.hash)`. It is wrapped in try/catch.
  - `components/SiteProvider.tsx` (client): `SiteProvider({ site, children })` and `useSite(): Site`.
  - `components/Document.tsx` (server): `Document({ lang, children })`. It renders `<html lang>` with the template's `--hand-line` style, imports the three font CSS files plus `globals.css`, and puts `REDIRECT_SCRIPT` in `<head>` when `lang === "en"`. It also emits Person/WebSite JSON-LD: `jobTitle "Technology & Customer Success Manager"`, `worksFor TREEO Indonesia`, `sameAs` GitHub and LinkedIn.
  - `generateMetadata` in both layouts: title `"<name> — <role>"`, `site.meta.description`, absolute canonical `SITE_URL + pathFor(lang)`, `alternates.languages` for en, id, zh and x-default, OpenGraph and Twitter tags with image `SITE_URL + "/apple-touch-icon.png"`, and icons from `public/`.
  - `components/HomePage.tsx` (server): `HomePage({ lang })` renders `<SiteProvider site={getSite(lang)}>` around the template page tree (SheetProvider, BoardProvider, Fog, sections, BoardLayer). Later tasks swap sections in here.
  - `app/(intl)/[lang]/page.tsx`: `generateStaticParams` returns `[{lang:"id"},{lang:"zh"}]`, and `dynamicParams = false`.
  - `components/LangSwitch.tsx` (client): `LangSwitch({ className? })`. It renders three `<a href={hrefFor(l)}>` separated by `·`, puts `aria-current="true"` on the current language, sets `localStorage.lang` in `onClick`, and has `aria-label={ui.language}` on the wrapper.

- [ ] **Step 1: Write failing unit tests.** `pathFor` returns `/`, `/id/`, `/zh/`. `hrefFor("zh")` is `/personal/zh/` when the env is stubbed. `REDIRECT_SCRIPT` contains `"/personal/"`, `"id"` and `"zh"`.
- [ ] **Step 2: Write the failing e2e** `e2e/i18n.spec.ts`:
  - For each of `/personal/`, `/personal/id/`, `/personal/zh/`, `html[lang]` is en / id / zh, the `link[rel=canonical]` href is the absolute URL, and there are 4 `link[rel=alternate][hreflang]`.
  - After `document.fonts.ready`, `document.fonts.check("18px Kalam")` is true and the body's computed `font-family` starts with `Kalam`.
  - With `localStorage.lang = "id"` set by an init script, visiting `/personal/` ends at `/personal/id/`.
  - Clicking `EN` on `/personal/id/` lands on `/personal/` and stays there.
- [ ] **Step 3: Run** `npm test` and `npm run build && npm run test:e2e`. Expected: FAIL.
- [ ] **Step 4: Implement** the files above and place `LangSwitch` temporarily at the top of `HomePage`. Task 7 moves it into the hero.
- [ ] **Step 5: Run everything.** Expected: all pass. `out/index.html`, `out/id/index.html`, `out/zh/index.html` and `out/404.html` exist.
- [ ] **Step 6: Commit.** `git commit -m "feat(i18n): handwritten type, per-language static pages, metadata, language switch"`

### Task 6: Sheets, rich text and the Projects rail

**Files:**
- Modify: `components/SheetProvider.tsx`, `components/RichText.tsx`, `components/Projects.tsx` (remove the `Thoughts` export from here; Task 9 replaces it), `components/visuals/Visual.tsx`, `components/HomePage.tsx`, `components/Icons.tsx` (add an `IconExternal`)
- Create: `tests/unit/sheet-hash.test.ts`, `e2e/projects.spec.ts`

**Interfaces:**
- Consumes: `useSite()`, plus `Site.projects`, `experience`, `moreProjectsHref` and `ui`.
- Produces from `SheetProvider.tsx`:
  - `type SheetTarget = { type: "project"; slug: string } | { type: "experience"; slug: string } | { type: "contact" }`
  - `hashFor(t: SheetTarget): string`, giving `#/work/<slug>`, `#/experience/<slug>`, `#/contact`
  - `parseHash(hash: string, site: Site): SheetTarget | null`, exported and pure
  - `useSheet()` → `{ open(t, origin?), close(), current }`
  - `ExperienceSheet` and `ContactSheet` render `null` until Tasks 9 and 11.
  - `Highlighted` stays exported. The sheet close button uses `ui.close`.

- [ ] **Step 1: Write the failing unit tests.** Against `getSite("en")`, `parseHash` gives:
  - `"#/work/tree-monitoring"` → project
  - `"#/work/nope"` → null
  - `"#/experience/operations-manager"` → experience
  - `"#/contact"` → `{type:"contact"}`
  - `"#board=abc"` → null
  - `""` → null
- [ ] **Step 2: Write the failing e2e** `e2e/projects.spec.ts`:
  - The rail has 7 cards: 6 projects plus a final "more projects" card linking to `moreProjectsHref`.
  - Clicking the current card opens a dialog with heading `AKAR DMRV`, sets the URL hash to `#/work/akar-dmrv`, and shows the confidential note. Escape closes it and clears the hash.
  - Keyboard (Review Focus 3): focus the first card button, press Enter, the dialog opens; press Escape, focus is back on that card.
  - `/personal/zh/#/work/tree-monitoring` opens directly with the ZH title. Its CTA `href` is the GitHub URL with `target=_blank`. `page.goBack()` after opening from a click closes the sheet.
  - Review Focus 2: with `localStorage.lang="id"`, `/personal/#/work/tree-monitoring` ends at `/personal/id/#/work/tree-monitoring` with the dialog visible.
  - Clicking a products-line link is covered in Task 7.
- [ ] **Step 3: Run.** Expected: FAIL.
- [ ] **Step 4: Implement.**
  - **SheetProvider:** generalise the target, read from `useSite()`, and render the ProjectSheet with `kind`, the tags as a muted `·` list, `confidential`, and the CTA as an external link with the right icon.
  - **RichText:** a seg with `project` or `experience` opens that sheet, a seg with `href` is an anchor, and an `http` href gets the external attributes.
  - **Projects.tsx:** the card foot is `title` + muted `kind`; apply the type scale.
  - **Visual.tsx:** replace every template placeholder word and number inside the mockups with neutral or project-fitting labels, keeping the visual structure. No "Tempo", "€", "Ledger", "Pinboard", "Driftmail" or "SAY LESS" may remain. Check with `grep -nE "Tempo|Ledger|Pinboard|Driftmail|€|SAY LESS|LOUDER" components/visuals/Visual.tsx`, which must print nothing.
- [ ] **Step 5: Run** `npm test && npm run build && npm run test:e2e`. Expected: all pass.
- [ ] **Step 6: Commit.** `git commit -m "feat(projects): project rail and sheets with deep links in three languages"`

### Task 7: Hero, Now and Organisations

**Files:**
- Modify: `components/Hero.tsx`, `components/Intro.tsx`, `components/SectionHeader.tsx`, `components/HomePage.tsx`
- Create: `e2e/intro.spec.ts`

**Interfaces:**
- Consumes: `useSite()` (`name`, `role`, `status`, `hero`, `now`, `organizations`, `productsLine`, `ui.sections`, `ui.opensNewTab`), `LangSwitch`, `RichText` and `useSheet`.
- Produces: section ids `#about`, `#now` and `#organizations`. `SectionHeader({ title, id })` keeps its signature and gets the new type scale.

- [ ] **Step 1: Write the failing e2e** `e2e/intro.spec.ts`:
  - `h1` reads "Mardiansyah Gunting" (EN/ID).
  - Clicking the status button brings `#now` into the viewport.
  - Five links inside `#organizations` have hrefs exactly equal to the spec table, in order, each with `target=_blank` and a `rel` containing `noopener`.
  - The Now text contains "Technology & Customer Success Manager".
  - Clicking "Tree Monitoring" in the products line opens the `#/work/tree-monitoring` sheet.
  - `LangSwitch` is visible in the first viewport.
  - Review Focus 5: in a `javaScriptEnabled: false` context, `h1`, the hero statement text and the 5 org links are visible.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Hero:** status pill and `LangSwitch` on the right, tooltip from `status.note`.
  - **Intro, Now block:** `now.lead`, then a TREEO badge (the `treeo.svg` logo `<img>` + `now.company`), then `now.rest`, then the `now.about` paragraphs in `text-muted`.
  - **Intro, Organisations grid:** `grid-cols-2 sm:grid-cols-3`. Each tile is the template `company-tile` with the logo `<img>` centred (object-contain, max 46% width, `mix-blend-multiply`). Name and note always show under the tile (not hover-only, so touch users see them) with `IconExternal`. `aria-label="<name> — <note> (<ui.opensNewTab>)"`. External attributes as in Global Constraints.
  - Remove the placeholder `Mark` and `CompanyBadge` SVGs.
- [ ] **Step 4: Run** the build and e2e. Expected: all pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(intro): hero, now and organisation tiles linking to official sites"`

### Task 8: Skills accordion and Education list

**Files:**
- Delete: `components/Services.tsx`
- Create: `components/Skills.tsx`, `components/Education.tsx`, `e2e/skills-education.spec.ts`
- Modify: `components/HomePage.tsx`

**Interfaces:**
- Consumes: `Site.skills`, `education`, `ui.sections.skills` and `ui.sections.education`.
- Produces: `Skills()` (id `skills`, the template accordion behaviour) and `Education()` (id `education`, an `<ol>` of rows in the accordion's line style: number, school, programme, period, optional grade, no expand).

- [ ] **Step 1: Write the failing e2e.**
  - Skills: 7 rows. Clicking row 1 sets `aria-expanded="true"` and the panel contains "Python". Clicking it again collapses it.
  - Education: 4 items, the first contains "Universitas Terbuka" and "3.25". In ZH the first item contains the `zh.json` `edu.0.school` value.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** both components and place them after Projects (Skills) and after Experience (Education). Until Task 9, Education sits right after Skills.
- [ ] **Step 4: Run.** Expected: pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(skills): skills accordion and education list"`

### Task 9: Experience rail and experience sheet

**Files:**
- Create: `components/Experience.tsx`, `e2e/experience.spec.ts`
- Modify: `components/SheetProvider.tsx` (`ExperienceSheet`), `components/HomePage.tsx`

**Interfaces:**
- Consumes: `Site.experience`, `organizations` (looked up via `experience.org`), `ui.readMore`, `ui.sections.experience`, `CardRail`, `Highlighted` and `useSheet`.
- Produces: `Experience()` (id `experience`), the template "Thoughts" document-card rail. Each card shows `role` (title), `period` (date line), `company` (muted line) and `body` with `Highlighted`. The card foot shows `company` and `ui.readMore`. Opening a card calls `open({ type: "experience", slug })`.

- [ ] **Step 1: Write the failing e2e.**
  - 9 cards, the first titled "Technology & Customer Success Manager".
  - Opening it sets hash `#/experience/customer-success-manager-2026`. The dialog shows exactly `photos.json["customer-success-manager-2026"].length` images, all `complete` with `naturalWidth > 0`, and a company link with href `https://treeo.id/` and `target=_blank`.
  - `#/experience/mobile-developer` shows no company link.
  - In ID, the period of card 1 contains "Sekarang".
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement `ExperienceSheet`.** Title `role`, a muted line `company` (linked when `org` is set) · `period`, the logo `<img>` at 40px, the body paragraphs with `Highlighted`, then the photos. Photos use `<img loading="lazy" width={w} height={h} alt>`, one column below 640px and two columns above, rounded. Order HomePage: Projects → Skills → Experience → Education.
- [ ] **Step 4: Run.** Expected: pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(experience): document-card rail and experience sheets with photos"`

### Task 10: Field-notes dive gallery

**Files:**
- Modify: `components/DiveGallery.tsx`, `components/HomePage.tsx`
- Create: `e2e/gallery.spec.ts`

**Interfaces:**
- Consumes: `Site.artifacts`, `ui.sections.gallery`, `ui.galleryHint`, `ui.close`, `ui.previous` and `ui.next`.
- Produces: `DiveGallery()` with section id `gallery` and a section header.

- [ ] **Step 1: Write the failing e2e.**
  - `#gallery [data-dive]` count equals the total photo count.
  - Clicking the first visible item opens the lightbox showing its `title`. ArrowRight changes the title. Escape closes it.
  - In a `reducedMotion: "reduce"` context, the gallery section is visible and the first image has computed opacity > 0.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Read items from `useSite()` and translate the labels. The section height formula stays as in the template.
- [ ] **Step 4: Run.** Expected: pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(gallery): field-notes dive gallery from job photos"`

### Task 11: Footer, contact sheet, draw-mode labels, legacy cleanup

**Files:**
- Modify: `components/Footer.tsx`, `components/SheetProvider.tsx` (`ContactSheet`), `components/board/Toolbar.tsx`, `components/board/BoardProvider.tsx`, `components/board/BoardLayer.tsx`, `components/Icons.tsx` (add `github` to `IconSocial`), `components/HomePage.tsx`
- Delete: `content/site.ts`, `components/Reveal.tsx` only if unused (check with grep)
- Create: `e2e/footer-contact.spec.ts`

**Interfaces:**
- Consumes: `Site.contact`, `social`, `ui.form`, `ui.board`, `ui.*` labels, `useSheet`, `useBoard` and `LangSwitch`.
- Produces: the final page. `ContactSheet` POSTs JSON `{ name, email, message }` with headers `Content-Type: application/json` and `Accept: application/json` to `contact.endpoint`. It treats `data.success === "true"` as sent. It shows `ui.form.incomplete` when any field is empty, and `sending`, `sent` or `error` otherwise, in a `role="status"` `aria-live="polite"` element.

- [ ] **Step 1: Write the failing e2e** `e2e/footer-contact.spec.ts`:
  - Scrolling the footer into view adds `is-inverted` to `html`.
  - The footer has an `img` with alt "Mardiansyah Gunting" and its src ending in `profile.jpg`, and the signature text "Mardiansyah Gunting".
  - With clipboard permissions granted, the email button copies `mardiansyah.gunting@yahoo.com` and shows `ui.copied`.
  - The CV link href equals `CV.en`; on `/personal/id/` it equals `CV.id`.
  - LinkedIn and GitHub links are present. `tel:+6287897434336` is present.
  - "Send a message" opens the dialog and sets hash `#/contact`, which shows the references.
  - Submitting empty shows the incomplete text. With `page.route("https://formsubmit.co/**", r => r.fulfill({ json: { success: "true" } }))`, a filled submit shows the sent text.
  - Pressing `e` shows the toolbar (`aria-label` = `ui.board.tools`). Escape hides it.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Footer:** portrait `<img src={asset("/profile.jpg")}>` 160×200 object-cover in the template's portrait box. Signature constant "Mardiansyah Gunting". Email copy. A links row: Download CV (external), Send a message, phone `tel:`, `press E`. Social icons. `LangSwitch`. `© {year} {name} — {ui.rights}`.
  - **ContactSheet:** the form in the template's sheet typography, plus contact info and references.
  - **Board files:** replace every hard-coded string listed in `grep -n '"[A-Z][a-z]' components/board/*.tsx` with `ui.board.*`.
  - Delete `content/site.ts`. `grep -rn "content/site\"" app components lib` must print nothing.
- [ ] **Step 4: Run** `npm test && npm run build && npm run test:e2e`. Expected: all pass.
- [ ] **Step 5: Commit.** `git commit -m "feat(footer): dark footer, contact sheet, translated draw mode; drop template content"`

### Task 12: Whole-page QA, visual pass, README

**Files:**
- Create: `e2e/layout.spec.ts`
- Modify: whatever the visual pass finds, and `README.md` (stack, commands, where content lives, how to regenerate photos, deploy)

- [ ] **Step 1: Write `e2e/layout.spec.ts`** (Review Focus 4). For each lang in en, id, zh, at each viewport 1440×900, 390×844 and 375×667:
  - Load the page and scroll to the bottom in steps so lazy content mounts.
  - `document.documentElement.scrollWidth <= innerWidth + 1`.
  - No failed requests.
  - Save a full-page screenshot to `test-results/screens/<lang>-<w>x<h>.png`.
  - Also screenshot the opened `#/experience/hpps-coordinator-assistant` sheet per language.
- [ ] **Step 2: Run it.** Fix any overflow until it passes.
- [ ] **Step 3: Visual review.** Compare the screenshots with `T/docs/screenshots/*.png`:
  - Spacing rhythm and column width (620px) match.
  - The handwriting is comfortable at body size in all three languages, especially the ZH experience sheet. Adjust sizes or line-height within the Global Constraints scale if a language reads cramped.
  - No template placeholder text is left anywhere: `grep -rnE "Alex Moreno|Northwind|Fieldnotes|ACME|example.com|Lisbon" app components content` prints nothing.
- [ ] **Step 4: Update README.md.** Run `npm test && npm run build && npm run test:e2e`. Expected: all pass.
- [ ] **Step 5: Commit.** `git commit -m "test: whole-page layout checks; docs: README for the new stack"`
