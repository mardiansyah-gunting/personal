# Skills Strength Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a horizontal bar chart to the "What I Bring" (Skills) section ranking 6 skill categories by how many of the 9 recorded roles use them, per the approved spec.

**Architecture:** Static data array in `Skills.astro` frontmatter (same pattern as `Experience.astro`'s `items`), rendered as a semantic `<ul>/<li>` list with CSS-driven bar widths — no chart library, no client JS beyond the existing i18n switcher. One new i18n attribute convention (`data-i18n-tooltip`) is added to the shared language-switch script so the hover-tooltip text translates too.

**Tech Stack:** Astro `.astro` components, plain CSS custom properties (`--accent`, `--bg-alt`, `--primary`, `--text-muted`), the project's existing inline i18n script in `src/layouts/BaseLayout.astro`. No new dependencies.

## Global Constraints

- No new npm dependency — chart is hand-built HTML/CSS (spec: "Out of scope").
- Single hue (`--accent #3b82f6`) for all bars; only the #1-ranked bar gets full strength, the rest share one lighter tint — never a per-bar color ramp (spec: "Visual design").
- Bar width = `count / 9 * 100%` exactly, matching the printed `X/9` label — no independent max-normalization (spec: "Visual design").
- Rows render top-to-bottom in the exact order of the spec's data table; only rank 1 gets the highlight color, all ties below it share the same muted tint (spec: "Visual design").
- Value (`X/9`) is always visible directly on the row; the hover tooltip only adds the "example duties" text and must never be the only way to read a value (spec: "Interaction").
- New i18n keys must exist in all three of `public/i18n/en.json`, `id.json`, `zh.json` (spec: "i18n").
- No dark-mode-specific CSS — the site has no dark theme wired up (spec: "Out of scope").

---

### Task 1: Teach the i18n switcher to translate tooltip attributes

**Files:**
- Modify: `src/layouts/BaseLayout.astro:59-79` (inside the `_setLang` function, right after the existing `data-i18n-placeholder` block)

**Interfaces:**
- Produces: any element with both `data-tooltip="<default text>"` and `data-i18n-tooltip="<translation key>"` will have its `data-tooltip` value replaced with `t[key]` whenever `_setLang(lang)` runs. Later tasks (Task 3) rely on this exact attribute pair.

- [ ] **Step 1: Read the current handler block to confirm the exact insertion point**

Run: `grep -n "data-i18n-placeholder" src/layouts/BaseLayout.astro`
Expected: one match around line 75-78, showing the `forEach` block for `data-i18n-placeholder`. Insert the new block immediately after this `forEach`'s closing `});` and before `_activeLang(lang);`.

- [ ] **Step 2: Add the new `data-i18n-tooltip` handler**

Insert this block right after the existing `data-i18n-placeholder` `forEach` (still inside `async function _setLang(lang) { ... }`, before the `_activeLang(lang);` line):

```js
      document.querySelectorAll('[data-i18n-tooltip]').forEach(function(el) {
        var k = el.dataset.i18nTooltip;
        if (t[k]) el.dataset.tooltip = t[k];
      });
```

- [ ] **Step 3: Verify the file still parses as valid Astro/JS**

Run: `npx astro check 2>&1 | tail -20`
Expected: no new errors referencing `BaseLayout.astro` (pre-existing unrelated warnings, if any, are fine — just confirm no syntax error was introduced at the edited lines).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: support translating tooltip text via data-i18n-tooltip"
```

---

### Task 2: Add the new i18n keys (en, id, zh)

**Files:**
- Modify: `public/i18n/en.json` (add keys after `"skills.lang.zh"`, before `"education.title"`)
- Modify: `public/i18n/id.json` (same insertion point)
- Modify: `public/i18n/zh.json` (same insertion point)

**Interfaces:**
- Produces: the translation keys `skills.chart_subtitle`, `skills.bar.<key>.label`, `skills.bar.<key>.detail` for `<key>` in `communication`, `fieldops`, `datamonitoring`, `training`, `uiux`, `opsmgmt` — Task 3's markup references these exact key strings.

- [ ] **Step 1: Add the English keys**

In `public/i18n/en.json`, insert after the `"skills.lang.zh": "Mandarin (Beginner)",` line:

```json
  "skills.chart_subtitle": "Based on how often each skill shows up across my 9 roles since 2018",
  "skills.bar.communication.label": "Communication & Stakeholder Relations",
  "skills.bar.communication.detail": "TPP & partner relations, user support, stakeholder collaboration, B2B communication, cross-team coordination",
  "skills.bar.fieldops.label": "Field Visits & On-site Operations",
  "skills.bar.fieldops.detail": "Field visits assessing user experience, on-the-ground TPP operations",
  "skills.bar.datamonitoring.label": "Data Monitoring, Quality & Reporting",
  "skills.bar.datamonitoring.detail": "Cloud activity monitoring, data quality & reporting, data collection & processing",
  "skills.bar.training.label": "Training & User Documentation",
  "skills.bar.training.detail": "User training, onboarding, and documentation",
  "skills.bar.uiux.label": "UI/UX & Product Design",
  "skills.bar.uiux.detail": "UI/UX enhancement, wireframes and high-fidelity mockups",
  "skills.bar.opsmgmt.label": "Operations & Process Management",
  "skills.bar.opsmgmt.detail": "Daily operations, asset/office management, compliance procedures",
```

- [ ] **Step 2: Add the Indonesian keys**

In `public/i18n/id.json`, insert after the `"skills.lang.zh": "Mandarin (Pemula)",` line:

```json
  "skills.chart_subtitle": "Berdasarkan seberapa sering tiap skill muncul di 9 posisi kerja saya sejak 2018",
  "skills.bar.communication.label": "Komunikasi & Hubungan Stakeholder",
  "skills.bar.communication.detail": "Hubungan dengan TPP & mitra, dukungan pengguna, kolaborasi stakeholder, komunikasi B2B, koordinasi lintas tim",
  "skills.bar.fieldops.label": "Kunjungan Lapangan & Operasional On-site",
  "skills.bar.fieldops.detail": "Kunjungan lapangan untuk menilai pengalaman pengguna, operasional TPP di lapangan",
  "skills.bar.datamonitoring.label": "Monitoring Data, Kualitas & Pelaporan",
  "skills.bar.datamonitoring.detail": "Monitoring aktivitas cloud, kualitas data & pelaporan, pengumpulan & pemrosesan data",
  "skills.bar.training.label": "Training & Dokumentasi Pengguna",
  "skills.bar.training.detail": "Pelatihan pengguna, onboarding, dan dokumentasi",
  "skills.bar.uiux.label": "UI/UX & Desain Produk",
  "skills.bar.uiux.detail": "Peningkatan UI/UX, wireframe dan mockup beresolusi tinggi",
  "skills.bar.opsmgmt.label": "Operasional & Manajemen Proses",
  "skills.bar.opsmgmt.detail": "Operasional harian, manajemen aset/kantor, prosedur kepatuhan",
```

- [ ] **Step 3: Add the Mandarin keys**

In `public/i18n/zh.json`, insert after the `"skills.lang.zh": "中文（初级）",` line:

```json
  "skills.chart_subtitle": "基于每项技能在我2018年至今9段工作经历中出现的频率",
  "skills.bar.communication.label": "沟通与利益相关方关系",
  "skills.bar.communication.detail": "TPP与合作伙伴关系、用户支持、利益相关方协作、B2B沟通、跨团队协调",
  "skills.bar.fieldops.label": "实地考察与现场运营",
  "skills.bar.fieldops.detail": "实地考察评估用户体验、现场TPP运营",
  "skills.bar.datamonitoring.label": "数据监控、质量与报告",
  "skills.bar.datamonitoring.detail": "云端活动监控、数据质量与报告、数据收集与处理",
  "skills.bar.training.label": "培训与用户文档",
  "skills.bar.training.detail": "用户培训、入职指导与文档编写",
  "skills.bar.uiux.label": "UI/UX与产品设计",
  "skills.bar.uiux.detail": "优化UI/UX、制作线框图与高保真原型图",
  "skills.bar.opsmgmt.label": "运营与流程管理",
  "skills.bar.opsmgmt.detail": "日常运营、资产/办公室管理、合规流程",
```

- [ ] **Step 4: Verify all three files are still valid JSON**

Run: `for f in public/i18n/en.json public/i18n/id.json public/i18n/zh.json; do python3 -m json.tool "$f" > /dev/null && echo "$f OK"; done`
Expected: `public/i18n/en.json OK`, `public/i18n/id.json OK`, `public/i18n/zh.json OK`

- [ ] **Step 5: Verify key parity across the three files (same key set)**

Run: `for f in en id zh; do python3 -c "import json; print(sorted(json.load(open('public/i18n/$f.json')).keys()))" > /tmp/keys_$f.txt; done; diff /tmp/keys_en.txt /tmp/keys_id.txt && diff /tmp/keys_en.txt /tmp/keys_zh.txt && echo "KEYS MATCH"`
Expected: `KEYS MATCH` (empty diffs)

- [ ] **Step 6: Commit**

```bash
git add public/i18n/en.json public/i18n/id.json public/i18n/zh.json
git commit -m "feat: add i18n keys for skills strength chart"
```

---

### Task 3: Render the chart markup in Skills.astro

**Files:**
- Modify: `src/components/Skills.astro:1-4` (frontmatter + opening of the template)

**Interfaces:**
- Consumes: `data-i18n-tooltip` attribute behavior from Task 1; translation keys from Task 2.
- Produces: DOM structure `ul.skill-bars > li.skill-bar-row[.skill-bar-top] > (span.skill-bar-label, span.skill-bar-track > span.skill-bar-fill, span.skill-bar-value)` that Task 4's CSS selectors target.

- [ ] **Step 1: Add the frontmatter data array**

At the top of `src/components/Skills.astro`, before the closing `---` of the frontmatter fence (the file currently starts directly with `<section id="skills" ...>` and has no frontmatter fence yet — add one):

```astro
---
const totalRoles = 9;
const skillBars = [
  { key: "communication", label: "Communication & Stakeholder Relations", detail: "TPP & partner relations, user support, stakeholder collaboration, B2B communication, cross-team coordination", count: 7 },
  { key: "fieldops", label: "Field Visits & On-site Operations", detail: "Field visits assessing user experience, on-the-ground TPP operations", count: 4 },
  { key: "datamonitoring", label: "Data Monitoring, Quality & Reporting", detail: "Cloud activity monitoring, data quality & reporting, data collection & processing", count: 4 },
  { key: "training", label: "Training & User Documentation", detail: "User training, onboarding, and documentation", count: 3 },
  { key: "uiux", label: "UI/UX & Product Design", detail: "UI/UX enhancement, wireframes and high-fidelity mockups", count: 3 },
  { key: "opsmgmt", label: "Operations & Process Management", detail: "Daily operations, asset/office management, compliance procedures", count: 3 },
];
---
```

- [ ] **Step 2: Insert the chart markup between the section title and the existing `.skills-grid`**

Find this existing line in `src/components/Skills.astro`:

```astro
    <h2 class="fade-in section-title" data-i18n="skills.subtitle">What I Bring</h2>
    <div class="skills-grid">
```

Replace it with:

```astro
    <h2 class="fade-in section-title" data-i18n="skills.subtitle">What I Bring</h2>
    <div class="skills-chart fade-in">
      <p class="skills-chart-subtitle" data-i18n="skills.chart_subtitle">Based on how often each skill shows up across my 9 roles since 2018</p>
      <ul class="skill-bars">
        {skillBars.map((s, i) => (
          <li
            class={`skill-bar-row${i === 0 ? " skill-bar-top" : ""}`}
            data-tooltip={s.detail}
            data-i18n-tooltip={`skills.bar.${s.key}.detail`}
            tabindex="0"
          >
            <span class="skill-bar-label" data-i18n={`skills.bar.${s.key}.label`}>{s.label}</span>
            <span class="skill-bar-track">
              <span class="skill-bar-fill" style={`width:${Math.round((s.count / totalRoles) * 100)}%`}></span>
            </span>
            <span class="skill-bar-value">{s.count}/{totalRoles}</span>
          </li>
        ))}
      </ul>
    </div>
    <div class="skills-grid">
```

- [ ] **Step 3: Start the dev server and confirm the markup renders**

Run:
```bash
npm run dev > /tmp/astro-dev.log 2>&1 &
disown
sleep 4
curl -s http://localhost:4321/portfolio-web | grep -o 'class="skill-bar-row[^"]*"' | sort | uniq -c
curl -s http://localhost:4321/portfolio-web | grep -o '[0-9]/9' | sort | uniq -c
```
Expected: `6` total `skill-bar-row` elements (one line showing `1 ... skill-bar-row skill-bar-top`, five showing plain `skill-bar-row`), and the value fractions `7/9`, `4/9` (×2), `3/9` (×3) each present.

- [ ] **Step 4: Commit**

```bash
git add src/components/Skills.astro
git commit -m "feat: render skills strength chart markup"
```

---

### Task 4: Style the chart (bars, emphasis color, tooltip, responsive layout)

**Files:**
- Modify: `src/components/Skills.astro` (inside the existing `<style>` block, right before the closing `</style>` tag / after the last existing rule)

**Interfaces:**
- Consumes: the exact class names produced by Task 3 (`skills-chart`, `skills-chart-subtitle`, `skill-bars`, `skill-bar-row`, `skill-bar-top`, `skill-bar-label`, `skill-bar-track`, `skill-bar-fill`, `skill-bar-value`) and the `data-tooltip` attribute.

- [ ] **Step 1: Append the chart CSS**

Add this block inside the existing `<style>` section of `src/components/Skills.astro` (after the last rule, `.tag-lang { ... }`):

```css
  .skills-chart {
    margin-bottom: 2.5rem;
  }

  .skills-chart-subtitle {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 1.25rem;
  }

  .skill-bars {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .skill-bar-row {
    display: grid;
    grid-template-columns: minmax(160px, 260px) 1fr auto;
    grid-template-areas: "label track value";
    align-items: center;
    gap: 0.85rem;
    position: relative;
  }

  .skill-bar-label {
    grid-area: label;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
  }

  .skill-bar-track {
    grid-area: track;
    height: 20px;
    background: var(--bg-alt);
    border-radius: 4px;
    overflow: hidden;
  }

  .skill-bar-fill {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: #bfdbfe;
  }

  .skill-bar-top .skill-bar-fill {
    background: var(--accent);
  }

  .skill-bar-value {
    grid-area: value;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--primary);
    min-width: 2.5rem;
    text-align: right;
  }

  .skill-bar-row::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 0;
    bottom: calc(100% + 8px);
    max-width: 320px;
    width: max-content;
    background: var(--primary);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1.4;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(4px);
    transition: opacity 0.2s, transform 0.2s;
    z-index: 5;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }

  .skill-bar-row:hover::after,
  .skill-bar-row:focus::after,
  .skill-bar-row:focus-visible::after {
    opacity: 1;
    transform: translateY(0);
  }

  .skill-bar-row:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .skill-bar-row {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        "label label"
        "track value";
      row-gap: 0.4rem;
    }
    .skill-bar-row::after {
      max-width: calc(100vw - 4rem);
    }
  }
```

- [ ] **Step 2: Screenshot the section on desktop and mobile widths**

Run (adjust the port/path if the dev server from Task 3 is no longer running — restart with the same `npm run dev` command first):
```bash
cat > ./scratch-shot.cjs << 'EOF'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto('http://localhost:4321/portfolio-web', { waitUntil: 'networkidle' });
  await desktop.locator('#skills').scrollIntoViewIfNeeded();
  await desktop.waitForTimeout(400);
  await desktop.screenshot({ path: '/tmp/skills-chart-desktop.png' });
  await desktop.hover('.skill-bar-row.skill-bar-top');
  await desktop.waitForTimeout(300);
  await desktop.screenshot({ path: '/tmp/skills-chart-tooltip.png' });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:4321/portfolio-web', { waitUntil: 'networkidle' });
  await mobile.locator('#skills').scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: '/tmp/skills-chart-mobile.png' });

  await browser.close();
})();
EOF
node ./scratch-shot.cjs && echo DONE
rm ./scratch-shot.cjs
```
Expected: `DONE` printed, three PNG files created at the paths above with no errors.

- [ ] **Step 3: Visually review the three screenshots**

Read each of `/tmp/skills-chart-desktop.png`, `/tmp/skills-chart-tooltip.png`, `/tmp/skills-chart-mobile.png`. Confirm:
- Desktop: 6 rows, top row's bar is solid accent blue and visibly the shortest-to-full-color one (others lighter blue), bars roughly proportional (7/9 longest, three 3/9 bars shortest and equal length to each other).
- Tooltip screenshot: a dark tooltip bubble is visible above the top row showing its detail text, not clipped off-screen.
- Mobile: label sits on its own line above the track+value row for every entry, no text overflow/clipping, no horizontal scroll introduced on the page.

If any check fails, fix the CSS in Step 1 and re-run Step 2 before proceeding.

- [ ] **Step 4: Commit**

```bash
git add src/components/Skills.astro
git commit -m "style: add bar, emphasis-color, and tooltip styling for skills chart"
```

---

### Task 5: End-to-end verification across languages, then stop the dev server

**Files:** none (verification only, no code changes)

**Interfaces:** none

- [ ] **Step 1: Confirm the Indonesian translation renders after switching language**

With the dev server from Task 3/4 still running:
```bash
cat > ./scratch-lang.cjs << 'EOF'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4321/portfolio-web', { waitUntil: 'networkidle' });
  await page.click('.lang-btn[data-lang="id"]');
  await page.waitForTimeout(300);
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const label = await page.locator('.skill-bar-top .skill-bar-label').textContent();
  const tooltip = await page.locator('.skill-bar-top').getAttribute('data-tooltip');
  console.log('LABEL:', label);
  console.log('TOOLTIP:', tooltip);
  await page.screenshot({ path: '/tmp/skills-chart-id.png' });
  await browser.close();
})();
EOF
node ./scratch-lang.cjs && echo DONE
rm ./scratch-lang.cjs
```
Expected: `LABEL: Komunikasi & Hubungan Stakeholder` and `TOOLTIP: Hubungan dengan TPP & mitra, dukungan pengguna, kolaborasi stakeholder, komunikasi B2B, koordinasi lintas tim` (the Indonesian detail text from Task 2), confirming `data-i18n-tooltip` (Task 1) is wired correctly.

- [ ] **Step 2: Confirm the production build succeeds**

Run: `npm run build 2>&1 | tail -30`
Expected: build completes with no errors (Astro prints a success summary, e.g. "X page(s) built").

- [ ] **Step 3: Stop the dev server**

Run: `pkill -f "astro dev" 2>/dev/null; echo done`
Expected: `done`

- [ ] **Step 4: Final review commit (only if Steps 1-2 caught something that needed fixing)**

If no fixes were needed in this task, skip this step — Task 4's commit already covers the working state. If a fix was needed:
```bash
git add -A
git commit -m "fix: correct skills chart i18n/build issue found in verification"
```
