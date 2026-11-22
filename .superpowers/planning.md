# Portfolio Repair & Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix hero/about glitch, experience errors, scroll dead-zone; upgrade Workflow Automation diagram + tool list; add bar chart to "What I Bring"; enrich Learning Path design; hyperlink footer name to LinkedIn.

**Architecture:** Single-page Astro 4 static site, vanilla CSS + SVG, hand-rolled scroll JS. Edits stay per-component in `src/components/`, i18n strings in `public/i18n/{en,id,zh}.json`, global styles in `src/styles/global.css`. No new dependencies.

**Tech Stack:** Astro 4.16, vanilla CSS custom-properties, inline SVG, IntersectionObserver + rAF scroll math.

**Specs:**
- `docs/superpowers/specs/2026-09-12-skills-strength-chart-design.md` (bar chart, task 5)
- This plan (`.superpowers/planning.md`)

## Global Constraints

- No JS/UI/chart libraries — hand-built SVG/CSS only.
- Preserve i18n pattern: every user-visible string via `data-i18n` keys in all 3 locale files (`en`, `id`, `zh`). BaseLayout engine sets `textContent` (destroys child nodes), so any element with `data-i18n` must contain NO child elements.
- Keep `prefers-reduced-motion: reduce` support; no motion when active.
- Build check each task: `npm run build` must pass. Manual check via `npm run dev`.
- Element with `data-i18n` = plain text only; wrap interleaved HTML (like the footer link) using separate keys on separate elements.
- No new CSS/TX preprocessors.
- Existing color tokens: `--primary #0f2b4c`, `--accent #3b82f6`, `--bg`, `--bg-alt`, `--border`.

---

### Task 1: About card — full text directly under photo, smooth reveal

**Files:**
- Modify: `src/components/Hero.astro` (markup lines 57–67, CSS 179–209, JS 416–464, media 383–398, reduced-motion 400–408)
- Modify: `src/pages/index.astro:141-145` (reduced-motion pin collapse)
- Test: `src/components/Hero.astro` short viewport states + `npm run build`

**Interfaces:**
- Consumes: existing `about.body`, `about.title`, `about.intro`, `about.subtitle` i18n keys (all present in en/id/zh)
- Produces: hero DOM order photo→desc→actions→social; desc composed of desktop label+body, mobile title+intro

**Problem:** `.hero-desc-label`/`.hero-desc-text` are `display:none` at all widths (`Hero.astro:186-189`), so the full "Who I Am" paragraph never renders on desktop. Desc appears *below* actions+social (order 6), not directly under the photo. Scroll fade is JS-only: if JS bails, desc's inline `opacity:0` persists.

- [ ] **Step 1: Reorder About directly under the photo**

Set `.hero-desc { order: 4 }`, `.hero-actions { order: 5 }`, `.hero-social { order: 6 }` in `Hero.astro` scoped CSS. Result flex order: badge(0) name(1) subtitle(2) photo(3) **desc(4)** actions(5) social(6).

- [ ] **Step 2: Responsive about content**

Desktop (min-width 769px): show `.hero-desc-label` + `.hero-desc-text`, hide `.hero-about-mobile`.
Mobile (≤768px): hide label/text, show compact `.hero-about-mobile`.

Replace `Hero.astro:186-209` block:

```css
.hero-desc-label,
.hero-desc-text {
  display: none;
}
.hero-about-mobile {
  display: block;
  /* existing styles … */
}
@media (min-width: 769px) {
  .hero-desc-label,
  .hero-desc-text {
    display: block;
  }
  .hero-about-mobile {
    display: none;
  }
}
```

Keep `.hero-about-mobile` styling as-is; `.hero-desc` keeps card-like presentation on desktop: give it `background: var(--bg-alt); border: 1px solid var(--border); border-radius: 20px; padding: 1.8rem 1.9rem; text-align: left;` matching the mobile card, so the full paragraph reads in a clean panel under the photo. `.hero-desc-label` styled like `h2` (font-size 1.15rem, weight 800, primary color, `margin-bottom .5rem`). `.hero-desc-text` styled like `.hero-about-intro` (0.98rem, line-height 1.8, `--text-muted`).

- [ ] **Step 3: Fail-safe reveal (JS-off / reduced-motion)**

JS sets `desc.style.opacity='0'` on init (`Hero.astro:428`). Guard it:

```js
var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq && mq.matches) {
  desc.style.opacity = '1';
  desc.style.transform = 'none';
  return;
}
desc.style.opacity = '0';
```

In CSS reduced-motion block already `opacity:1 !important` (`Hero.astro:405-407`); add a `.no-js` fallback via `<noscript>` in `index.astro`? — simpler: rely on reduced-motion rule + the JS guard above. Also verify the intro elements (badge/name/subtitle/actions/social) become visible when JS bails: default CSS opacity is 1, so only desc needs the guard.

- [ ] **Step 4: Short-viewport clip fix**

`.hero` is `overflow:hidden` + `min-height:100vh`; tall desc (desktop ~2 paragraphs) can clip on `max-height < 700px`. Add to the existing `(max-height: 640px)` media query (`Hero.astro:383-398`) — extend class to `(max-height: 800px)` so on short screens the mobile compact card shows instead of the long desktop paragraph. In that media block force `.hero-desc-label,.hero-desc-text{display:none}` and `.hero-about-mobile{display:block}` (mobile-like compactness on short desktop).

- [ ] **Step 5: Collapse hero-pin on reduced-motion at ALL widths**

`index.astro:141-145` collapses `.hero-pin` only at `max-width:768px`, while `Hero.astro:400-408` un-sticks the hero at all widths → ~140vh dead scroll on desktop reduced-motion. Remove the width cap:

```css
@media (prefers-reduced-motion: reduce) {
  .hero-pin {
    height: auto;
  }
  .hero-pin-anchor {
    top: 0;
  }
}
```

- [ ] **Step 6: Photo sizing/CLS hygiene**

Add `width="220" height="220"` attrs to `<img class="hero-photo-img">` (`Hero.astro:58`) and `fetchpriority="high"`; CSS `aspect-ratio:1` already present, so layout is stable.

- [ ] **Step 7: Build + manual verify**

Run: `npm run build` → PASS.
Manual (`npm run dev`): desktop shows full "Who I Am" paragraph in card directly under photo; tablet/mobile shows compact intro; short viewport shows compact card no clipping; reduced-motion (desktop) has no dead scroll and about text visible immediately.

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "fix(hero): show full about under photo, smooth on reduced-motion"
```

---

### Task 2: Experience section — deterministic photos, full gallery, stop runaway rAF

**Files:**
- Modify: `src/components/Experience.astro` (frontmatter 9–18, thumbs 66–75, CSS 258, JS 587–648)
- Test: build + scroll log

**Interfaces:**
- Consumes: existing `getJobImages(slug)` per item; photo dirs under `public/images/jobs/<slug>/`
- Produces: sorted image list; all rendered to gallery + lightbox; rAF stops when disabled

**Problems:** (1) `fs.readdirSync` unsorted → "main" photo varies macOS vs Linux CI. (2) `slice(1,4)` → photos beyond 4 unreachable (customer-success-manager-2026 has 5). (3) `requestAnimationFrame(frame)` loops forever. (4) `measure()` reads `scrollWidth` pre-image-load → drift. (5) `.exp-period` `white-space:nowrap` can overflow narrow cards.

- [ ] **Step 1: Deterministic sort**

`Experience.astro:12-14`:

```js
return fs.readdirSync(dir)
  .filter(f => imgExts.has(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b))
  .map(f => `${baseUrl}/images/jobs/${slug}/${f}`);
```

Result stable across OS. (Note: filename order = gallery order; keep filenames as-is.)

- [ ] **Step 2: Show all photos, fix lightbox set**

Replace `imgs.slice(1, 4)` (`Experience.astro:71`) with `imgs.slice(1)` so every extra photo renders. Lightbox `Experience.astro:553-556` already collects all rendered `img` children of `.exp-media` (minus `exp-empty-logo`) — with all thumbs now rendered, every photo is reachable. Thumbs grid handles 1–4 items fine.

- [ ] **Step 3: Stop runaway rAF**

`Experience.astro:622-642`: keep a handle and never re-schedule when disabled or when track gone:

```js
var rafId = 0;
function frame() {
  if (enabled && pin && track) {
    /* existing math … */
    rafId = requestAnimationFrame(frame);
  }
}
function start() { cancelAnimationFrame(rafId); if (enabled && pin && track) rafId = requestAnimationFrame(frame); }
start();
```

Call `start()` after every `measure()` (initial + resize at `:646-648`).

- [ ] **Step 4: Re-measure after images load**

Guard `measure()` (`:600-614`): after computing, attach one `load` listener per media img to re-run `measure()` once (fixes `scrollWidth` drift from lazy images). Use a once-flag per card to avoid repeated re-measures.

- [ ] **Step 5: Period overflow**

`Experience.astro:258` `.exp-period` → add `max-width: 100%; white-space: normal; overflow-wrap: anywhere;` (breaks "May 2026 – Present" safely on narrow cards instead of bleeding out).

- [ ] **Step 6: CLS hygiene**

Add `width`/`height` attrs to `exp-photo-main` (aspect handled by CSS `aspect-ratio:4/3` at ≤820px; give `width="800" height="600"` as hint) and to thumbs `width="90" height="64"`.

- [ ] **Step 7: Build + manual verify**

`npm run build` PASS.
Dev scroll: horizontal scroll smooth; gallery for 5-photo job shows all 5 and lightbox navigates 1→5; resizing recomputes width; scroll stops fully when window ≥820 uses static layout — confirm via devtools performance panel that no rAF spam remains.

- [ ] **Step 8: Commit**

```bash
git add src/components/Experience.astro
git commit -m "fix(experience): deterministic photos, full gallery, stop rAF loop"
```

---

### Task 3: Global scroll health — dead-zone + smoothness

**Files:**
- Modify: `src/pages/index.astro` (section-indicator 156–242)
- Modify: `src/styles/global.css` (21–31) — verification only
- Verify: `src/components/Hero.astro` task-1 result (no double pin logic)

**Interfaces:**
- Consumes: hero-pin collapsed state from Task 1
- Produces: correct `#about` anchor hit + no dead scroll + stable body overflow

- [ ] **Step 1: Section indicator after pin collapse**

`index.astro:176-182` `anchorY()` returns `0` for `home`/`about`. With pin collapsed (reduced-motion), `#about` should still resolve: change `anchorY('about')` to use `document.getElementById('about')` offsetTop like other sections (it exists as `hero-pin-anchor`). Keep `home → 0`.

- [ ] **Step 2: Rethread `aboutEnd` math**

`index.astro:193-201` computes `homeEnd`/`aboutEnd` from pin travel. When reduced-motion collapses pin to `height:auto`, pinTravel math yields ~0 → `aboutEnd` lands inside hero. Guard: if pin has zero travel (auto height), treat `about` as ordinary section (use its offsetTop). Verify active dot for `about` lights during scroll and after pin collapse.

- [ ] **Step 3: Overflow audit**

`global.css:21-31` has `overflow-x:hidden` on html+body. Confirm `.hero` `overflow:hidden` doesn't clip the resolved about card (Task 1 short-viewport fix handles it). No change expected here beyond Task 1; keep as verification checkpoint, not a code change.

- [ ] **Step 4: Build + dev scroll sanity**

`npm run build` PASS. Dev: smooth native scroll; section dots track correctly; anchor nav `#about` through header works; reduced-motion desktop has zero dead scroll.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "fix(scroll): correct section tracking after hero-pin collapse"
```

---

### Task 4: Workflow Automation card — scientific diagram + real tool list

**Files:**
- Modify: `src/components/Projects.astro` (automation card 119–232, SVGs 137–225, CSS `.aw-*` 684–703)
- Modify: `public/i18n/en.json`, `id.json`, `zh.json` (add `projects.automation.tools`)
- Test: build + dev

**Interfaces:**
- Consumes: confirmed tool list — `pandas · openpyxl · python-dotenv · schedule · logging`
- Produces: technical pipeline diagram + tools row on card

- [ ] **Step 1: Add tool list to card**

After `project-tags` (`Projects.astro:128-133`), add tools sub-row:

```html
<div class="project-tools">
  <span class="project-tools-label" data-i18n="projects.automation.tools_label">Built with</span>
  <div class="project-tools-chips">
    <span class="tool-chip">pandas</span>
    <span class="tool-chip">openpyxl</span>
    <span class="tool-chip">python-dotenv</span>
    <span class="tool-chip">schedule</span>
    <span class="tool-chip">logging</span>
  </div>
</div>
```

Style `.project-tools` as a soft strip (bg-alt panel, rounded, muted mono font for chips). Add i18n key `projects.automation.tools_label` to all three locale files ("Built with"/"Dibangun dengan"/"使用工具").

- [ ] **Step 2: Scientific diagram polish**

Refine inline SVG (`Projects.astro:137-225`) for technical-schematic readability:
- Consistent 4-column grid; tighten coordinates so boxes align on a common horizontal ruler.
- Annotate each stage with a small step badge (`01 · SOURCE`, `02 · VALIDATE`, `03 · PROCESS`, `04 · DELIVER`).
- Cleaner arrows: single `marker-end` def (`<defs><marker id="awArrow" …/></defs>`) instead of hand-built arrowheads; keep existing `aw-flow`/`aw-return` classed paths.
- Replace dashed decorative dots ring with subtle grid lines (schematic look).
- Keep the gear + pulse animation; they read as "processing".

- [ ] **Step 3: Animation robustness**

`.aw-*` animations assume `transform-box: view-box`/`fill-box` (`Projects.astro:684-703`). Add explicit safe fallback so a browser ignoring `transform-box` still progresses the diagram (e.g., use `transform-origin: center` + `transform-box: fill-box` both set; wrap gear spin so it degrades to static, never broken layout). Verified with cross-browser check in dev.

- [ ] **Step 4: Build + verify zoom modal**

`npm run build` PASS. Dev: diagram renders clean (no overlapping text, no clipped gear), zoom modal opens, wheel/pan work, tools row shows pandas/openpyxl/dotenv/schedule/logging.

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects.astro public/i18n/en.json public/i18n/id.json public/i18n/zh.json
git commit -m "feat(projects): technical automation diagram with real tool stack"
```

---

### Task 5: What I Bring — bar chart per spec + content

**Files:**
- Modify: `src/components/Skills.astro` (replace radar 75–111, clean dead CSS 227–268)
- Modify: `public/i18n/{en,id,zh}.json` (add `skills.chart_title`, `skills.chart_subtitle`, `skills.bar.*`)
- Test: build + dev responsive

**Interfaces:**
- Consumes: data table from `docs/superpowers/specs/2026-09-12-skills-strength-chart-design.md` (6 categories, role counts 7/9,4/9,4/9,3/9,3/9,3/9)
- Produces: CSS bar chart (hand-built `<ul>`/`<li>`), no chart lib

- [ ] **Step 1: Data + i18n keys**

Add `skills.chart_title` ("Strength by work history") and `skills.chart_subtitle` ("How often each strength appears across my 9 roles"). Add `skills.bar.<key>.label` and `skills.bar.<key>.detail` for keys `communication, fieldops, datamonitoring, training, uiux, opsmgmt`, using the tooltip text from the spec table, in all three locales.

- [ ] **Step 2: Replace radar with spec bar chart**

Delete the radar `skillValues`/`radar*` frontmatter and `.skills-top`/`.radar-wrap` SVG block; replace with semantic HTML:

```html
<div class="strength-chart fade-in">
  <h3 class="skill-group-title" data-i18n="skills.chart_title">Strength by work history</h3>
  <p class="skills-top-sub" data-i18n="skills.chart_subtitle">…</p>
  <ul class="bar-list">
    <li class="bar-row" style="--cnt:7; --max:9;">
      <span class="bar-label" data-i18n="skills.bar.communication.label">Communication & Stakeholder Relations</span>
      <span class="bar-track"><span class="bar-fill"></span></span>
      <span class="bar-value">7/9</span>
      <span class="bar-tip" data-i18n="skills.bar.communication.detail">…</span>
    </li>
    <!-- 5 more rows, order = spec table order -->
  </ul>
</div>
```

CSS per spec: track = unfilled remainder in lighter step of same ramp, fill = `--accent` full strength for rank 1 row, shared lighter `--accent` tint (e.g. `#bfdbfe`) for all other rows; bar ≤24px thick, 4px rounded at value end, square baseline, 2px row gap, no axis line. `width: calc(var(--cnt) / var(--max) * 100%)`. Tooltip via `.bar-row:hover .bar-tip` (CSS-only, `opacity/pointer-events` toggles, `position:absolute`, no JS).

- [ ] **Step 3: Responsive**

At ≤768px, `.bar-label` moves above the bar+value row (label on own line, bar+value below) — match existing breakpoint convention.

- [ ] **Step 4: Clean dead CSS**

Remove `.top-skills`, `.top-skill`, `.top-rank` (`Skills.astro:227-268`) and all `radar-*` rules. Keep `.skills-top-sub` reuse.

- [ ] **Step 5: Build + verify**

`npm run build` PASS. Dev: bars render in spec order, width matches `X/9` label exactly, rank-1 row full accent, others lighter, hover tooltip on each, mobile stacks labels, no chart lib in bundle.

- [ ] **Step 6: Commit**

```bash
git add src/components/Skills.astro public/i18n/en.json public/i18n/id.json public/i18n/zh.json
git commit -m "feat(skills): bar chart backed by role history per spec"
```

---

### Task 6: Learning Path — richer cards, accurate progress

**Files:**
- Modify: `src/components/Education.astro` (items 3–8, markup 11–31, CSS 33–154)
- Modify: `src/pages/index.astro` (timeline JS 246–275)
- Modify: `public/i18n/{en,id,zh}.json` (new `edu.<i>.label`, `edu.<i>.focus` arrays)
- Test: build + dev scroll

**Interfaces:**
- Consumes: `eduItems` array (4 entries: UT, Binar×2, SMKN1)
- Produces: status-aware cards with skill-focus chips + proportionally-correct fill

- [ ] **Step 1: Enrich data model**

Extend each `eduItems` entry with `status` ("Ongoing"/"Completed") and `focus` array (topics learned):

```js
{ index: 0, period: "2024 – Present", school: "Universitas Terbuka", major: "Business Management (Undergraduate)", logo: `${baseUrl}/images/schools/ut.png`, status: "Ongoing", focus: ["Business strategy", "Operations", "Data-driven decisions"] },
{ index: 1, period: "Jun 2023 – Nov 2023", school: "Binar Academy", major: "Data Science Bootcamp", logo: `${baseUrl}/images/schools/binar.png`, status: "Completed", focus: ["Python", "Statistics", "Machine learning"] },
{ index: 2, period: "Dec 2022 – May 2023", school: "Binar Academy", major: "Mobile Development Bootcamp", logo: `${baseUrl}/images/schools/binar.png`, status: "Completed", focus: ["Kotlin", "Android", "UI/UX"] },
{ index: 3, period: "Jul 2017 – Aug 2019", school: "SMKN 1 Sampit", major: "Information Technology Engineering", logo: `${baseUrl}/images/schools/smkn1.png`, status: "Completed", focus: ["Networking", "Programming", "IT basics"] },
```

- [ ] **Step 2: Richer card markup**

Inside `.edu-card` (`Education.astro:19-25`), add a status pill and a focus-chip row using the built-in `data-i18n-tags` mechanism (`BaseLayout.astro:66-77`).

- [ ] **Step 3: Design polish**

- Card: lift shadow on `.active`, accent left border using `--accent` (consistency with skill cards), slight `translateY(-2px)` when active.
- Dots: larger ring when active `box-shadow: 0 0 0 6px rgba(59,130,246,.14)` (existing pattern, strengthen).
- Timeline line: make nodes proportionally spaced by setting `.edu-timeline .tl-item { flex: 1 0 0; }` equal width so `--fill = activeCount/total*100` matches actual dot positions. Item count 4 → each 25%.

- [ ] **Step 4: Fill accuracy**

`index.astro:253-257` computes `activeCount/items.length`. With `flex:1` equal items the ratio mirrors geometry. Leave JS logic; add equal-width CSS. Wrap `.tl-item`s in a flex row (desktop horizontal). Adjust existing mobile padding at `Education.astro:149-153`.

- [ ] **Step 5: i18n**

Add `edu.<i>.status` keys ("Ongoing"/"Sedang berjalan"/"进行中", "Completed"/"Selesai"/"已完成") and `edu.<i>.focus` full strings joined by `", "` for `data-i18n-tags` rendering.

- [ ] **Step 6: Build + verify**

`npm run build` PASS. Dev: cards have status pill + focus chips; fill bar aligns with dots; horizontal layout intact desktop; mobile padding keeps dots visible; active hover lifts card.

- [ ] **Step 7: Commit**

```bash
git add src/components/Education.astro src/pages/index.astro public/i18n/en.json public/i18n/id.json public/i18n/zh.json
git commit -m "feat(education): richer learning path cards with status and focus"
```

---

### Task 7: Footer name hyperlink → LinkedIn

**Files:**
- Modify: `src/components/Footer.astro:4`
- Modify: `public/i18n/{en,id,zh}.json` (split `footer.copyright`)

**Interfaces:**
- Consumes: LinkedIn URL `https://www.linkedin.com/in/mardiansyah-gunting/`
- Produces: clickable name in copyright line

**Problem:** i18n engine replaces whole element text via `textContent` (`BaseLayout.astro:64`), so a single `data-i18n="footer.copyright"` element cannot contain an `<a>` child. Split into own-key elements.

- [ ] **Step 1: Markup**

Replace `Footer.astro:4`:

```html
<p class="footer-copy">
  &copy; {new Date().getFullYear()}
  <a href="https://www.linkedin.com/in/mardiansyah-gunting/" target="_blank" rel="noopener noreferrer" class="footer-name" data-i18n="footer.name">Mardiansyah Gunting</a>.
  <span data-i18n="footer.rights">All rights reserved.</span>
</p>
```

New keys `footer.name`, `footer.rights` added to `en.json`, `id.json`, `zh.json` (name identical across locales; rights translated). Remove stale `footer.copyright` key from all locales.

- [ ] **Step 2: Style**

`.footer-name { color: var(--accent); font-weight: 600; text-decoration: none; transition: color .2s; }` `.footer-name:hover { color: var(--primary); text-decoration: underline; }`.

- [ ] **Step 3: Build + verify**

`npm run build` PASS. Dev: name is a link, opens LinkedIn in new tab, hover styles, i18n switch (id/zh) keeps link and translates "All rights reserved."

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro public/i18n/en.json public/i18n/id.json public/i18n/zh.json
git commit -m "feat(footer): linkedin hyperlink on copyright name"
```

---

### Task 8: Favicon + final verification

**Files:**
- Modify: `src/layouts/BaseLayout.astro:18`
- Create: `public/favicon.ico` (small valid icon, ≥16×16)

**Interfaces:**
- Consumes: `baseUrl` (subpath `/portfolio-web`)

**Problem:** `/favicon.ico` hardcoded absolute (`BaseLayout.astro:18`) 404s under GitHub Pages subpath; current file is 0 bytes.

- [ ] **Step 1: Fix path**

`<link rel="icon" type="image/x-icon" href={`${baseUrl}favicon.ico`} />`.

- [ ] **Step 2: Provide real icon**

Generate a small valid `.ico` (e.g., 32×32 solid `--primary` rounded square with "M"-like glyph) into `public/favicon.ico`, replacing the 0-byte file.

- [ ] **Step 3: Final gate**

Run `npm run build` clean. Then `git status` — confirm only intended files. Optional: `npm run preview` sanity in browser.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro public/favicon.ico
git commit -m "fix(layout): favicon path via base url with real icon"
```