# Task 4 Report: Base Layout

**Status:** DONE

## Steps Completed

1. Created `src/layouts/BaseLayout.astro` with:
   - HTML shell with `<head>`, charset, viewport, description, favicon, Google Fonts (Inter)
   - CSS import from `../styles/global.css`
   - Inline `<script>` for theme initialization (localStorage + prefers-color-scheme)
   - Inline `<script>` for i18n: `__setLanguage`, `loadLanguage`, `getCurrentLang`, `data-i18n`/`data-i18n-placeholder` binding
   - `<slot />` for child content

2. Build verification: `npm run build` passed successfully (static site, 0 pages built, no errors).

## Commit

- `ca46dc7` feat: add BaseLayout with i18n and theme init scripts
