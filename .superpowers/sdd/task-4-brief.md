### Task 4: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `src/styles/global.css`
- Produces: HTML shell with `<head>`, global styles, inline i18n init + theme init

- [ ] **Step 1: Create BaseLayout.astro**

```astro
---
import '../styles/global.css';

export interface Props {
  title?: string;
}

const { title = "Mardiansyah Gunting" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Mardiansyah Gunting - Portfolio" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>{title}</title>
</head>
<body>
  <slot />
  <script>
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const translations = {};

    async function loadLanguage(lang) {
      if (translations[lang]) return;
      const res = await fetch(`i18n/${lang}.json`);
      translations[lang] = await res.json();
    }

    function getCurrentLang() {
      return localStorage.getItem('lang') || 'en';
    }

    window.__setLanguage = async function(lang) {
      localStorage.setItem('lang', lang);
      await loadLanguage(lang);
      const t = translations[lang];
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) el.placeholder = t[key];
      });
    };

    const savedLang = getCurrentLang();
    if (savedLang !== 'en') {
      document.addEventListener('DOMContentLoaded', () => window.__setLanguage(savedLang));
    }
    document.documentElement.lang = savedLang;
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify build still passes**

Run: `npm run build`
Expected: Build succeeds.

