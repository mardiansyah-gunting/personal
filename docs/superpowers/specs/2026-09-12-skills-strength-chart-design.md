# Skills Strength Chart — "What I Bring" section

## Overview

Add a horizontal bar chart to the Skills section (`src/components/Skills.astro`,
heading "What I Bring") that ranks Mardiansyah's skills by how often they appear
across his 9 recorded roles (Experience section, 2018–present). The goal is to give
readers an at-a-glance answer to "what skill does this person use most," backed by
his actual work history rather than a subjective self-rating.

## Data

Derived by reading all 9 `Experience.astro` entries and grouping their descriptions
into 6 recurring skill categories. Metric = number of roles (out of 9) whose
description matches the category. Approved by the user on 2026-09-12.

| Rank | Category | Roles | Example duties (tooltip) |
|---|---|---|---|
| 1 | Communication & Stakeholder Relations | 7/9 | TPP & partner relations, user support, stakeholder collaboration, B2B communication, cross-team coordination |
| 2 | Field Visits & On-site Operations | 4/9 | Field visits assessing user experience, on-the-ground TPP operations |
| 2 | Data Monitoring, Quality & Reporting | 4/9 | Cloud activity monitoring, data quality & reporting, data collection & processing |
| 4 | Training & User Documentation | 3/9 | User training, onboarding, and documentation |
| 4 | UI/UX & Product Design | 3/9 | UI/UX enhancement, wireframes and high-fidelity mockups |
| 4 | Operations & Process Management | 3/9 | Daily operations, asset/office management, compliance procedures |

Data lives as a hardcoded array in `Skills.astro`'s frontmatter, following the same
pattern as the `items` array in `Experience.astro`. Not derived programmatically from
the experience data at build time — the categorization is an editorial judgment call,
not a mechanical parse, so it's recorded as a static, human-reviewed array.

## Placement

Inside `#skills`, directly under the `<h2 data-i18n="skills.subtitle">` heading and
above the existing `.skills-grid` (Management / Technical / Languages cards). Order
top to bottom: section title → strength chart → detailed skill-tag cards.

## Visual design

Rows render top-to-bottom in the exact order of the Data table above (descending by
role-count; ties broken by the table's listed order). Only the #1 row gets the
full-strength accent — ties at lower ranks (both 4/9 rows, all three 3/9 rows) share
the same lighter tint, since the highlight marks "the single top strength," not a
top-N cutoff.

Single-series magnitude chart → one hue, no legend (per dataviz skill: a legend is
only for ≥2 series; one color needs none).

- Bars use `--accent` (`#3b82f6`), the site's existing brand blue.
- **Emphasis, not a per-bar ramp**: the #1 bar (Communication & Stakeholder
  Relations) is full-strength `--accent`. All other bars use one shared lighter
  tint of the same hue (e.g. `#bfdbfe`-range). This is a binary highlight-vs-rest
  split, not a continuous darker-if-bigger ramp (which the dataviz skill flags as
  double-encoding length as color).
- Bar track (the unfilled remainder) is a lighter step of the same ramp so the
  full-width context is always visible, in line with the "meter" mark spec.
- Each row: category label (left) — bar (center) — value label `X/9 roles` (right,
  direct-labeled, not hidden behind hover).
- Mark spec: bars ≤24px thick, 4px rounded end at the value side, square at the
  baseline, 2px gap between rows. Hairline/no heavy gridlines — the track itself
  shows extent, so no separate axis line is needed.
- Bar width = `count / 9 * 100%`, i.e. the fill's visual proportion always matches
  the printed `X/9` label exactly (no separate max-normalization that could make
  the bar look longer/shorter than the label implies).

## Interaction

Each row has a CSS-only hover tooltip (title-like custom tooltip via `:hover` +
`::after`, no JS) showing the "example duties" text from the table above. This is a
pure enhancement: the ranking and the `X/9` value are already visible without
hovering, so the tooltip never gates access to the core data (dataviz skill
requirement — tooltips enhance, never gate).

## Responsive behavior

Follows the existing breakpoints already used elsewhere in the site (768px, 480px):
on narrow viewports the label moves to its own line above the bar+value row (same
stacking approach `Experience.astro` uses for its header row), so long category
names never get clipped.

## i18n

New keys added to `public/i18n/{en,id,zh}.json`, following the existing
`data-i18n="…"` attribute pattern:

- `skills.chart_title`, `skills.chart_subtitle`
- `skills.bar.<key>.label` and `skills.bar.<key>.detail` for each of the 6
  categories, where `<key>` is a short slug (`communication`, `fieldops`,
  `datamonitoring`, `training`, `uiux`, `opsmgmt`).

## Out of scope

- No new dependency (no chart library, no canvas/SVG plotting). Rendered as plain
  semantic HTML (`<ul>`/`<li>`) with CSS-driven bar widths, matching the rest of the
  site's hand-built approach.
- No dark-mode-specific styling — the site has no dark theme implemented yet
  (confirmed: `theme.light`/`theme.dark` i18n strings exist but no toggle or
  `prefers-color-scheme`/`data-theme` CSS is wired up anywhere in the codebase).
- No live recomputation from `Experience.astro` — if experience entries change
  again in the future, this chart's data array is updated by hand (same as the
  editorial judgment calls made in the "history" analysis, not a mechanical
  refresh).
