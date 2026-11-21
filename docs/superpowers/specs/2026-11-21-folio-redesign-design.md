# Portfolio redesign — "folio" look, handwritten type

Date: 2026-11-21 · Branch: `dev` · Reference: `~/Downloads/folio-template.zip` (Next.js + Tailwind template, see its `README.md`, `docs/REVERSE-ENGINEERING.md`, `docs/screenshots/`).

## Intent

Mardiansyah wants the whole portfolio to look and behave like the folio template: one quiet centred column, a big hero sentence with hand-drawn underlines, company tiles with a cursor glow, draggable card rails that grow into full-screen detail sheets, an accordion, a 3D "dive" photo gallery, a footer that turns the page dark and "writes" a signature, and the press-`E` draw mode. The goal is a site that reads as **professional and intuitive** to recruiters, partners and clients.

Two personal requests on top of the template:

1. **All text in a handwritten typeface** (user picked option C: every piece of text, not just accents).
2. **The organisations section links to each organisation's official website.**

Content stays his: the current site's text is the source, adjusted and shortened only where a template slot needs it. Nothing new is invented (no made-up years, metrics, clients or quotes).

## Goals

- Visual and interaction parity with the template (layout, spacing, motion, sheets, rails, gallery, footer invert, draw mode, fog, reveal).
- Every piece of text set in handwriting, still easy to read in EN, ID and ZH, on desktop and a 375px phone.
- All current content carried over in all three languages (EN / ID / ZH).
- Organisation tiles that open the organisation's site in a new tab.
- Keeps deploying as a static site to GitHub Pages under `/personal`.

## Non-goals

- No blog/notes content (the template's "Thoughts" rail is reused for Experience).
- No top navigation bar, section-indicator dots, or light/dark toggle (the template has none; the footer invert is the only dark state).
- No CMS, no new projects, no new photos.

## Anti-goals (failure even if it "works")

- Handwriting so small or wild that job descriptions or Chinese text become hard to read.
- Invented facts (project years, numbers) presented as real.
- Broken asset paths or links once served under `/personal` on GitHub Pages.
- A heavy page: the raw job photos go up to 3120×4160; shipping them as-is to the gallery is a failure.
- Losing any of the three languages, the CV links, the contact form, or the references.

## Constraints

- Static hosting: GitHub Pages, base path `/personal`, `site` = `https://mardiansyah-gunting.github.io`. Workflow `.github/workflows/deploy.yml` (push to `main`).
- Repo has two remotes: `origin` (portfolio-web, master data) and `personal` (publication). Work on `dev`; never push to either without the user asking.
- Free / OFL fonts only.
- Must respect `prefers-reduced-motion`, be keyboard-usable, and keep visible focus.
- Local Node is 26; CI should use Node 22 (Next 16 needs ≥ 20.9).

## Approaches considered

| Approach | Trade-off |
|---|---|
| **A. Next.js static export, template code as the base** (chosen) | Highest fidelity and least work: the template's React components (rails, sheets, dive gallery, draw mode) are reused as-is. Replaces Astro; deploy changes from `dist/` to `out/`. Ships React (~60 KB gz). |
| B. Keep Astro, mount the template as one React island | Same visuals, but two frameworks to maintain, needs an Astro 5 + `@astrojs/react` + Tailwind 4 upgrade, and the template's page-wide providers force one big island anyway. |
| C. Keep Astro, port everything to vanilla JS/CSS | Lightest page, same stack, but ~2,000 lines of interaction code rewritten by hand — slowest and riskiest route to parity. |

The user talked only about outcomes, so the builder chose **A** and stated it; the user did not object.

## Decisions

### Stack
- Replace the Astro app with the template's Next.js 16 / React 19 / Tailwind 4 structure (`app/`, `components/`, `content/`, `lib/`).
- `next.config.mjs`: `output: "export"`, `basePath: "/personal"`, `trailingSlash: true`, `images.unoptimized: true`.
- Plain `<img src>` and CSS `url()` are **not** prefixed by Next's `basePath`; every public asset path goes through one helper (e.g. `asset("/images/…")`) that prefixes the base path.
- Remove `src/`, `astro.config.mjs` and the `astro` dependency once ported. Keep `public/` assets (images, favicons, `profile.jpg`, `robots.txt`, `sitemap.xml`). `public/i18n/*.json` is the content source during the port; delete it once its content lives in `content/`.
- Deploy workflow: Node 22, upload `out` instead of `dist`.

### Languages
- Three statically generated pages: `/personal/` (EN), `/personal/id/`, `/personal/zh/`, from one typed content shape with one content object per language.
- A small `EN · ID · 中文` switch is reachable from the top of the page (near the status pill) and in the footer. Choosing a language stores it under the existing `localStorage` key `lang`; visiting `/personal/` with a saved non-EN choice redirects to that language.
- `<html lang>`, title, description, canonical and `hreflang` are set per page.
- The current `public/i18n/id.json` wins over earlier commits: the docx revision (`3d1d64d`, later than `a366385`/`ed1f609`) set the ID tagline back to Indonesian ("Operator Andal | Pembangun Automasi"), so ID shows that. Rule for any conflict: the current JSON files are the latest decision.
- Indonesian copy reuses the user's docx-revised wording in `public/i18n/id.json` wherever the English source sentence is unchanged; the same for ZH from `zh.json`. New or shortened sentences are translated fresh in the same tone.

### Typography (option C: everything handwritten)
- **Latin (EN/ID), all UI text:** one handwriting family, `Kalam` (OFL), used for everything — identity, hero, labels, rails, sheets, accordion, form, footer, draw-mode toolbar labels. One family keeps the template's "one weight, hierarchy from colour and space" feel.
- **Signature in the footer:** `Mrs Saint Delafield` (as in the template).
- **Chinese:** `LXGW WenKai` (霞鹜文楷, OFL), a legible handwritten Kai style, self-hosted with unicode-range subsets so only used glyphs download. Fallback stack ends in a system Kai face.
- Sizes go up versus the template because handwriting has a small x-height: body ≈ 18px (template 15px), hero ≈ 26–30px desktop. Final sizes are tuned by screenshot so a full job description stays comfortable to read.
- Colours and tokens stay the template's (`--bg #fff`, `--ink #181818`, `--muted #666`, `--line #f0f0f0`, `--tile #f5f5f3`, accent `#2fb36a`, inverted footer tokens). The previous TREEO green palette and Fluent About card are retired.

### Page structure and content mapping (top to bottom)

Source of truth for wording: `public/i18n/{en,id,zh}.json` (newer than the hard-coded strings in the `.astro` files). Data such as links, tags, logos and photo folders come from the current components.

1. **Hero (`#about`)**
   - Left: `Mardiansyah Gunting` / muted line `Reliable Operator · Automation Builder` (`hero.tagline`).
   - Right: status pill **"Open to work"** with tooltip "Open to new roles and collaborations" (from `about.p2`); clicking scrolls to Now. Language switch sits with it.
   - Statement (word-reveal, hand underlines): built from `about.lead`, ending with where he does it today, e.g. "…clearing away the repetitive work that quietly slows a business down. Today I do that at <u>TREEO Indonesia</u>, for tree growers across <u>Indonesia</u>." Underlined words link to the Organisations section / the TREEO tile.
2. **Now (`#now`)**: "Right now I'm Technology & Customer Success Manager at [TREEO logo badge]." + a one-line version of `exp.0.desc` (field visits, TREEO cloud, app UI/UX, partner training). Below it, in the same plain-paragraph style as the template's Now text (no new component), `about.p1` (Python automation, reporting out of spreadsheets) and `about.p2` (startups, NGOs, government; open to new roles) as two short muted paragraphs, lightly trimmed. `about.p1` is the evidence behind "Automation Builder", so it stays.
3. **Organisations (`#organizations`)** — the user's explicit request. Template "Companies" tiles (grain glow following the cursor), each with the real logo from `public/images/logos/`, name, a muted note (years · role), and an external-link affordance. Whole tile is a link, `target="_blank" rel="noopener noreferrer"`:
   | Organisation | Note | Link |
   |---|---|---|
   | PT Solusi Hutan Digital (TREEO Indonesia) | 2026 – now | https://treeo.id/ |
   | Fairventures Digital GmbH (TREEO) | 2023 – 2026 | https://treeo.one/ |
   | Fairventures Worldwide gGmbH | 2019 – 2023 | https://www.fairventures.org/ |
   | CV Karya Hidup Sentosa (Quick) | 2019 | https://quick.co.id/ |
   | Badan Pusat Statistik | 2018 | https://www.bps.go.id/ |

   Freelance consulting is not an organisation and gets no tile. Then the template's "products line", condensed from `projects.intro` (internal automation for Fairventures Digital, open-source Android apps, AI tools to speed up work): e.g. "Along the way I build my own tools, often with AI in the loop: <u>Workflow Automation</u>, <u>Tree Monitoring</u>, <u>CAD Converter</u> and <u>TechMentoring</u>." — each opens its project sheet.
4. **Projects (`#projects`)** — card rail + detail sheets, deep links `#/work/<slug>`. Six projects, wording from `projects.*`, tags/links from `Projects.astro`:
   AKAR DMRV (internal), TREEO Indonesia Website (CTA "Visit website" → treeo.id), Workflow Automation (internal; cover/gallery = `public/images/automation-flow.png`, "Built with" tools), Tree Monitoring, CAD Converter, TechMentoring (CTA "View on GitHub"). Internal projects show the "Source is confidential…" note instead of a CTA. Final card: "Want to see more? → GitHub" (link to repositories tab).
   - The card foot shows **title + short kind** (e.g. "Android app", "Internal · Flutter"), **not a year** — years are not in the source and must not be invented.
   - Covers use the template's generative mockups (phone, browser, darkapp, chart, specimen…), with their placeholder text replaced by text that fits each project (e.g. the phone shows a tree-health / DBH screen for Tree Monitoring). No fake product names or numbers from the template remain.
5. **Skills (`#skills`)** — template Services accordion, numbered rows: the five skill groups (`skills.cat.*`, tags from `Skills.astro` as the panel text), a **Languages** row, and a row presenting the strength ranking from the current chart (`skills.bar.*`, with the role counts from `Skills.astro`) as a simple ranked list. The bar chart itself is retired.
6. **Experience (`#experience`)** — the template "Thoughts" document-card rail, one card per role, newest first (9 roles, `exp.0`–`exp.8`): title = role, date = period, a company line, body = the description (multi-line descriptions split into short paragraphs; one key phrase per card highlighted with the template's yellow highlight). Card foot: company + "Read more". Opening a card grows a sheet (deep link `#/experience/<slug>`) with role, company (linked to its website when it has a tile), period, full description, logo, and that role's photos from `public/images/jobs/<slug>/`.
7. **Education (`#education`)** — four entries (`edu.*`) as a plain list in the accordion's visual language (number, school, programme, period; grade for Universitas Terbuka). No expand needed.
8. **Field notes gallery (`#gallery`)** — the template 3D dive gallery with the job photos (all folders in `public/images/jobs/`), title = role, kind = company, aspect ratio taken from each image's real size; lightbox on select; "Scroll to dive · Select to look closer" translated.
9. **Footer (`#contact`)** — page inverts dark; portrait = `public/profile.jpg`; signature "Mardiansyah Gunting" writes in; email `mardiansyah.gunting@yahoo.com` (click copies); links: Download CV (the WPS link for the current language, from `Hero.astro`), Send a message (opens the contact sheet), phone `+6287897434336`, `press E`; icons LinkedIn + GitHub; language switch; `© <year> Mardiansyah Gunting — All rights reserved.`
10. **Contact sheet** (deep link `#/contact`) — the current form (name, email, message) posting to the existing `formsubmit.co` endpoint with the existing status messages, plus contact info and the two references with phone numbers (`contact.ref*`).
11. **Draw mode** (press `E`), fog, reveal-on-scroll, word reveal — kept as in the template, every movable block tagged with `data-board`.

### Text with no template slot
- `hero.subtitle` ("Project Management · Data Automation · Operational Excellence") is not shown on the page; it feeds the meta description.
- `about.focus` tags are dropped: the Skills accordion covers the same ground.
- `projects.intro` becomes the products line (above).
- `about.p1` / `about.p2` live in the Now section (above).

### SEO and metadata
Carry over title, Person/WebSite JSON-LD and OG/Twitter tags from `BaseLayout.astro`, updated: `jobTitle` = "Technology & Customer Success Manager", `worksFor` = TREEO Indonesia, `sameAs` adds LinkedIn. The meta description is rewritten (the current "geospatial & software developer" line no longer fits) from `hero.tagline` + `hero.subtitle` + `about.lead`, about 155 characters, one per language. `sitemap.xml` lists the three language URLs.

## Verification expectations
- `npm run build` produces `out/`; serve it under `/personal/` locally and check: no 404s (assets, fonts, images), all three languages, every sheet and deep link, rails by drag and keyboard, gallery + lightbox, footer invert, draw mode, organisation links open the right sites.
- Screenshots at 1440×900 and 390×844 (plus 375×667 for the phone floor) in EN, ID and ZH; readability of a full experience sheet in each language is the bar.
- Reduced-motion and keyboard pass.
- The contact form is not submitted during testing (it sends a real email).

## Left to the builder
- Exact copy edits where a slot needs a shorter sentence, keeping the user's wording and tone.
- How the content files are split, the language-redirect script, the asset helper.
- Tile grid arrangement for five organisations, Education list styling, card sizes.
- Which mockup goes with which project and the text inside them.
- How photos are resized for the gallery and sheets (e.g. a committed set of web-sized copies), as long as the page stays light.
- Font loading details (npm `@fontsource` packages vs self-hosted files), subject to legibility checks.

## Builder's own calls (flag for the user)
- Status label "Open to work".
- Fairventures Digital → `treeo.one`; BPS → national `bps.go.id` (internship office not stated; `kotimkab.bps.go.id` if it was BPS Kotawaringin Timur).
- Project years dropped in favour of a short "kind" label.
- Strength chart turned into an accordion row.
- `Kalam` + `LXGW WenKai` as the handwriting faces.
- Unslotted text: `about.p1`/`p2` into Now, `projects.intro` into the products line, `hero.subtitle` into the meta description, `about.focus` dropped.
- ID tagline stays Indonesian, as in the current `id.json`.
- Meta description rewritten per language.
