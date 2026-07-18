# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page portfolio for Mardiansyah Gunting in 3 languages (EN/ID/ZH), deployed to GitHub Pages.

**Architecture:** Astro static site — zero JS runtime overhead. i18n via JSON files toggled client-side. CSS custom properties for theming (light/dark). Native Intersection Observer for scroll animations.

**Tech Stack:** Astro 4+, CSS custom properties, JSON i18n, GitHub Actions + GitHub Pages.

## Global Constraints

- No JavaScript framework (React/Vue/Svelte) — pure Astro components + vanilla JS only
- No Tailwind — pure CSS via custom properties
- Dark mode via `prefers-color-scheme` + manual toggle stored in localStorage
- i18n switch without page reload (client-side translation swap)
- All text content must exist in all 3 languages (EN, ID, ZH)
- Responsive: mobile-first, breakpoints at 768px and 1024px
- Files use lowercase-kebab-case naming

---
### File Structure

```
portfolio-web/
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.ico
│   └── i18n/
│       ├── en.json
│       ├── id.json
│       └── zh.json
├── src/
│   ├── layouts/BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Experience.astro
│   │   ├── Skills.astro
│   │   ├── Education.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── styles/global.css
│   ├── pages/index.astro
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `public/favicon.ico` (placeholder)

**Interfaces:**
- Consumes: nothing
- Produces: working Astro project scaffold

- [ ] **Step 1: Create package.json**

```json
{
  "name": "portfolio-web",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mardiansyah-gunting.github.io',
  base: '/portfolio-web',
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: Create src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Create placeholder favicon**

Run: `touch public/favicon.ico`

- [ ] **Step 6: Install dependencies and verify build**

Run: `npm install && npm run build`
Expected: `astro build` completes without errors, `dist/` directory created.

### Task 2: Global CSS — Custom Properties, Dark Mode, Animations

**Files:**
- Create: `src/styles/global.css`

**Interfaces:**
- Consumes: nothing
- Produces: CSS custom properties, reset, dark mode, scroll animations consumed by all components

- [ ] **Step 1: Write global.css**

```css
:root {
  --primary: #0f2b4c;
  --primary-light: #1e4d7a;
  --accent: #3b82f6;
  --bg: #ffffff;
  --bg-alt: #f1f5f9;
  --text: #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --radius: 8px;
  --max-width: 1100px;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

[data-theme="dark"] {
  --primary: #1e3a5f;
  --primary-light: #2d5a8e;
  --bg: #0f172a;
  --bg-alt: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  transition: background 0.3s, color 0.3s;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section {
  padding: 5rem 0;
}

.section-alt {
  background: var(--bg-alt);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.section-subtitle {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: var(--text-muted);
  margin-bottom: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-light);
  text-decoration: none;
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: #fff;
  text-decoration: none;
}

.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls src/styles/global.css`

### Task 3: i18n — Translation Files + Client-Side Logic

**Files:**
- Create: `public/i18n/en.json`
- Create: `public/i18n/id.json`
- Create: `public/i18n/zh.json`

**Interfaces:**
- Consumes: nothing
- Produces: JSON translation files fetched at runtime by the i18n initialization script

- [ ] **Step 1: Create english translations**

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.skills": "Skills",
  "nav.education": "Education",
  "nav.contact": "Contact",
  "hero.name": "Mardiansyah Gunting",
  "hero.tagline": "Dependable Task Manager | Eager Learner",
  "hero.subtitle": "Project Management \u00b7 AI \u00b7 Operational Excellence",
  "hero.cta_contact": "Get in Touch",
  "hero.cta_cv": "Download CV",
  "about.title": "About Me",
  "about.subtitle": "Who I Am",
  "about.body": "I am a result-driven professional with a strong foundation in Project Management and a growing passion for Artificial Intelligence. I thrive at the intersection of operations, technology, and strategy \u2014 bridging teams, streamlining processes, and driving measurable outcomes. With experience spanning startups, international NGOs, and government institutions, I bring adaptability, cross-cultural communication, and a continuous improvement mindset to every role. I believe the future belongs to those who can connect domain expertise with emerging technology, and I am committed to being at that frontier.",
  "experience.title": "Experience",
  "experience.subtitle": "My Professional Journey",
  "exp.0.role": "Operation Manager",
  "exp.0.company": "Fairventures Digital GmbH",
  "exp.0.period": "May 2024 \u2013 Present",
  "exp.0.desc": "Designed and implemented new SOPs across departments, eliminating bottlenecks. Pioneered customer-centric operational frameworks. Led cross-functional projects for operational excellence. Established KPI dashboards for data-driven decision-making.",
  "exp.1.role": "Customer Success Engineer",
  "exp.1.company": "Fairventures Digital GmbH",
  "exp.1.period": "May 2023 \u2013 May 2024",
  "exp.1.desc": "Conducted field visits assessing TREEO technology user experience. Monitored daily activities on TREEO cloud. Enhanced UI/UX of TREEO Apps. Provided comprehensive user support and training.",
  "exp.2.role": "Junior Android Developer",
  "exp.2.company": "CV Kusuma Wijaya",
  "exp.2.period": "Oct 2022 \u2013 Apr 2023",
  "exp.2.desc": "Built Android apps using Android Studio with Kotlin and Java. Created mobile and web app mockups.",
  "exp.3.role": "HPPS Project Coordinator Assistant",
  "exp.3.company": "Fairventures Worldwide gGmbH",
  "exp.3.period": "Feb 2022 \u2013 Mar 2023",
  "exp.3.desc": "Prepared data flow and safety materials. Managed data collection and processing. Ensured safety procedures compliance across all staff.",
  "exp.4.role": "General Affairs Officer",
  "exp.4.company": "Fairventures Worldwide gGmbH",
  "exp.4.period": "Oct 2019 \u2013 Feb 2022",
  "exp.4.desc": "Managed office contracts and asset handovers. Coordinated security and driver operations. Maintained fleet of four vehicles. Tracked all company assets.",
  "exp.5.role": "Demonstration Officer",
  "exp.5.company": "CV Karya Hidup Sentosa",
  "exp.5.period": "Jul 2019 \u2013 Sep 2019",
  "exp.5.desc": "Handled B2B communication. Demonstrated Quick Tractor product to oil palm plantations across Sumatra, Sulawesi, and Borneo.",
  "exp.6.role": "Intern",
  "exp.6.company": "Badan Pusat Statistik",
  "exp.6.period": "Jul 2018 \u2013 Dec 2018",
  "exp.6.desc": "Designed the cover for the annual book report. Created posters and vector graphics for the Annual Book.",
  "skills.title": "Skills",
  "skills.subtitle": "What I Bring",
  "skills.management": "Management",
  "skills.management_items": "Management, Problem-solving, Communication, Leadership",
  "skills.technical": "Technical",
  "skills.technical_items": "Mobile Software Development, Basic GIS, Web Development, Data Analysis, Software Automation",
  "skills.languages": "Languages",
  "skills.lang.en": "English (Professional)",
  "skills.lang.id": "Indonesian (Native)",
  "skills.lang.nl": "Dutch (Beginner)",
  "skills.lang.zh": "Mandarin (Beginner)",
  "education.title": "Education",
  "education.subtitle": "My Learning Path",
  "edu.0.school": "Binar Academy",
  "edu.0.major": "Data Science Bootcamp",
  "edu.0.period": "Jun 2023 \u2013 Nov 2023",
  "edu.1.school": "Binar Academy",
  "edu.1.major": "Mobile Software Engineering Bootcamp",
  "edu.1.period": "Dec 2022 \u2013 May 2023",
  "edu.2.school": "Universitas Terbuka",
  "edu.2.major": "Business Management (Undergraduate)",
  "edu.2.period": "2020 \u2013 Present",
  "edu.3.school": "SMKN 1 Sampit",
  "edu.3.major": "Information Technology Engineering",
  "edu.3.period": "Jul 2017 \u2013 Aug 2019",
  "contact.title": "Contact",
  "contact.subtitle": "Let\u2019s Connect",
  "contact.name": "Name",
  "contact.email": "Email",
  "contact.message": "Message",
  "contact.send": "Send Message",
  "contact.info_title": "Contact Info",
  "contact.phone": "(+62) 812 5008 8282",
  "contact.email_addr": "mardiansyah.gunting@gmail.com",
  "contact.location": "Palangka Raya, Indonesia",
  "contact.ref_title": "References",
  "contact.ref1": "Dr. Sebastian Lenz \u2013 Senior Consultant, Future Camp",
  "contact.ref1_phone": "+491733713510",
  "contact.ref2": "Owen James \u2013 Investment Adviser, Austrade",
  "contact.ref2_phone": "+61450961522",
  "footer.copyright": "\u00a9 2024 Mardiansyah Gunting. All rights reserved.",
  "theme.light": "Light",
  "theme.dark": "Dark"
}
```

- [ ] **Step 2: Create Indonesian translations**

```json
{
  "nav.home": "Beranda",
  "nav.about": "Tentang",
  "nav.experience": "Pengalaman",
  "nav.skills": "Keahlian",
  "nav.education": "Pendidikan",
  "nav.contact": "Kontak",
  "hero.name": "Mardiansyah Gunting",
  "hero.tagline": "Manajer Tugas Andal | Pembelajar Tekun",
  "hero.subtitle": "Manajemen Proyek \u00b7 AI \u00b7 Keunggulan Operasional",
  "hero.cta_contact": "Hubungi Saya",
  "hero.cta_cv": "Unduh CV",
  "about.title": "Tentang Saya",
  "about.subtitle": "Siapa Saya",
  "about.body": "Saya seorang profesional berorientasi hasil dengan fondasi kuat di Manajemen Proyek dan minat yang berkembang terhadap Kecerdasan Buatan. Saya berkembang di persimpangan antara operasional, teknologi, dan strategi \u2014 menjembatani tim, menyederhanakan proses, dan mendorong hasil yang terukur. Dengan pengalaman meliputi startup, NGO internasional, dan institusi pemerintah, saya membawa kemampuan adaptasi, komunikasi lintas budaya, dan pola pikir perbaikan berkelanjutan ke setiap peran. Saya percaya masa depan milik mereka yang dapat menghubungkan keahlian domain dengan teknologi yang berkembang, dan saya berkomitmen untuk berada di garda terdepan.",
  "experience.title": "Pengalaman",
  "experience.subtitle": "Perjalanan Profesional Saya",
  "exp.0.role": "Operation Manager",
  "exp.0.company": "Fairventures Digital GmbH",
  "exp.0.period": "Mei 2024 \u2013 Sekarang",
  "exp.0.desc": "Merancang dan mengimplementasikan SOP baru di seluruh departemen, mengeliminasi hambatan. Menjadi pionir kerangka kerja operasional yang berfokus pada pelanggan. Memimpin proyek lintas fungsi untuk keunggulan operasional. Membangun dashboard KPI untuk pengambilan keputusan berbasis data.",
  "exp.1.role": "Customer Success Engineer",
  "exp.1.company": "Fairventures Digital GmbH",
  "exp.1.period": "Mei 2023 \u2013 Mei 2024",
  "exp.1.desc": "Melakukan kunjungan lapangan untuk menilai pengalaman pengguna teknologi TREEO. Memantau aktivitas harian di cloud TREEO. Meningkatkan UI/UX aplikasi TREEO. Memberikan dukungan dan pelatihan pengguna secara komprehensif.",
  "exp.2.role": "Junior Android Developer",
  "exp.2.company": "CV Kusuma Wijaya",
  "exp.2.period": "Okt 2022 \u2013 Apr 2023",
  "exp.2.desc": "Membangun aplikasi Android menggunakan Android Studio dengan Kotlin dan Java. Membuat mockup aplikasi mobile dan web.",
  "exp.3.role": "Asisten Koordinator Proyek HPPS",
  "exp.3.company": "Fairventures Worldwide gGmbH",
  "exp.3.period": "Feb 2022 \u2013 Mar 2023",
  "exp.3.desc": "Menyiapkan alur data dan materi keselamatan. Mengelola pengumpulan dan pemrosesan data. Memastikan kepatuhan prosedur keselamatan di seluruh staf.",
  "exp.4.role": "General Affairs Officer",
  "exp.4.company": "Fairventures Worldwide gGmbH",
  "exp.4.period": "Okt 2019 \u2013 Feb 2022",
  "exp.4.desc": "Mengelola kontrak kantor dan serah terima aset. Mengkoordinasikan operasional keamanan dan pengemudi. Merawat armada empat kendaraan. Melacak semua aset perusahaan.",
  "exp.5.role": "Demonstration Officer",
  "exp.5.company": "CV Karya Hidup Sentosa",
  "exp.5.period": "Jul 2019 \u2013 Sep 2019",
  "exp.5.desc": "Menangani komunikasi B2B. Mendemonstrasikan produk Quick Tractor ke perkebunan kelapa sawit di Sumatera, Sulawesi, dan Kalimantan.",
  "exp.6.role": "Intern",
  "exp.6.company": "Badan Pusat Statistik",
  "exp.6.period": "Jul 2018 \u2013 Des 2018",
  "exp.6.desc": "Mendesain sampul laporan buku tahunan. Membuat poster dan grafik vektor untuk Buku Tahunan.",
  "skills.title": "Keahlian",
  "skills.subtitle": "Yang Saya Miliki",
  "skills.management": "Manajemen",
  "skills.management_items": "Manajemen, Pemecahan Masalah, Komunikasi, Kepemimpinan",
  "skills.technical": "Teknis",
  "skills.technical_items": "Pengembangan Software Mobile, GIS Dasar, Pengembangan Web, Analisis Data, Otomasi Software",
  "skills.languages": "Bahasa",
  "skills.lang.en": "Inggris (Profesional)",
  "skills.lang.id": "Indonesia (Native)",
  "skills.lang.nl": "Belanda (Pemula)",
  "skills.lang.zh": "Mandarin (Pemula)",
  "education.title": "Pendidikan",
  "education.subtitle": "Jalur Pembelajaran Saya",
  "edu.0.school": "Binar Academy",
  "edu.0.major": "Data Science Bootcamp",
  "edu.0.period": "Jun 2023 \u2013 Nov 2023",
  "edu.1.school": "Binar Academy",
  "edu.1.major": "Mobile Software Engineering Bootcamp",
  "edu.1.period": "Des 2022 \u2013 Mei 2023",
  "edu.2.school": "Universitas Terbuka",
  "edu.2.major": "Manajemen Bisnis (S1)",
  "edu.2.period": "2020 \u2013 Sekarang",
  "edu.3.school": "SMKN 1 Sampit",
  "edu.3.major": "Teknik Informatika",
  "edu.3.period": "Jul 2017 \u2013 Agu 2019",
  "contact.title": "Kontak",
  "contact.subtitle": "Mari Terhubung",
  "contact.name": "Nama",
  "contact.email": "Email",
  "contact.message": "Pesan",
  "contact.send": "Kirim Pesan",
  "contact.info_title": "Info Kontak",
  "contact.phone": "(+62) 812 5008 8282",
  "contact.email_addr": "mardiansyah.gunting@gmail.com",
  "contact.location": "Palangka Raya, Indonesia",
  "contact.ref_title": "Referensi",
  "contact.ref1": "Dr. Sebastian Lenz \u2013 Konsultan Senior, Future Camp",
  "contact.ref1_phone": "+491733713510",
  "contact.ref2": "Owen James \u2013 Penasihat Investasi, Austrade",
  "contact.ref2_phone": "+61450961522",
  "footer.copyright": "\u00a9 2024 Mardiansyah Gunting. Hak cipta dilindungi.",
  "theme.light": "Terang",
  "theme.dark": "Gelap"
}
```

- [ ] **Step 3: Create Chinese translations**

```json
{
  "nav.home": "\u9996\u9875",
  "nav.about": "\u5173\u4e8e",
  "nav.experience": "\u7ecf\u5386",
  "nav.skills": "\u6280\u80fd",
  "nav.education": "\u6559\u80b2",
  "nav.contact": "\u8054\u7cfb",
  "hero.name": "Mardiansyah Gunting",
  "hero.tagline": "\u53ef\u9760\u7684\u4efb\u52a1\u7ba1\u7406\u8005 | \u52e4\u594b\u7684\u5b66\u4e60\u8005",
  "hero.subtitle": "\u9879\u76ee\u7ba1\u7406 \u00b7 AI \u00b7 \u8fd0\u8425\u5353\u8d8a",
  "hero.cta_contact": "\u8054\u7cfb\u6211",
  "hero.cta_cv": "\u4e0b\u8f7d\u7b80\u5386",
  "about.title": "\u5173\u4e8e\u6211",
  "about.subtitle": "\u6211\u662f\u8c01",
  "about.body": "\u6211\u662f\u4e00\u4f4d\u4ee5\u7ed3\u679c\u4e3a\u5bfc\u5411\u7684\u4e13\u4e1a\u4eba\u58eb\uff0c\u62e5\u6709\u575a\u5b9e\u7684\u9879\u76ee\u7ba1\u7406\u57fa\u7840\u548c\u5bf9\u4eba\u5de5\u667a\u80fd\u65e5\u76ca\u589e\u957f\u7684\u70ed\u60c5\u3002\u6211\u5728\u8fd0\u8425\u3001\u6280\u672f\u548c\u6218\u7565\u7684\u4ea4\u6c47\u70b9\u4e0a\u5d1b\u5cf0\u9012\u5347\u2014\u2014\u8fde\u63a5\u56e2\u961f\u3001\u7b80\u5316\u6d41\u7a0b\u3001\u9a71\u52a8\u53ef\u8861\u91cf\u7684\u6210\u679c\u3002\u51ed\u501f\u5728\u521b\u59cb\u4f01\u3001\u56fd\u9645\u975e\u653f\u5e9c\u7ec4\u7ec7\u548c\u653f\u5e9c\u673a\u6784\u7684\u7ecf\u5386\uff0c\u6211\u5728\u6bcf\u4e2a\u5c97\u4f4d\u4e0a\u90fd\u5e26\u6765\u9002\u5e94\u80fd\u529b\u3001\u8de8\u6587\u5316\u4ea4\u6d41\u548c\u6301\u7eed\u6539\u8fdb\u7684\u601d\u7ef4\u3002\u6211\u76f8\u4fe1\u672a\u6765\u5c5e\u4e8e\u90a3\u4e9b\u80fd\u5c06\u4e13\u4e1a\u9886\u57df\u4e0e\u65b0\u5174\u6280\u672f\u8fde\u63a5\u8d77\u6765\u7684\u4eba\uff0c\u6211\u81f4\u529b\u4e8e\u7ad9\u5728\u8fd9\u4e00\u524d\u6cbf\u3002",
  "experience.title": "\u7ecf\u5386",
  "experience.subtitle": "\u6211\u7684\u804c\u4e1a\u65c5\u7a0b",
  "exp.0.role": "\u8fd0\u8425\u7ecf\u7406",
  "exp.0.company": "Fairventures Digital GmbH",
  "exp.0.period": "2024\u5e745\u6708 \u2013 \u73b0\u5728",
  "exp.0.desc": "\u8bbe\u8ba1\u5e76\u5b9e\u65bd\u8de8\u90e8\u95e8\u7684\u65b0SOP\uff0c\u6d88\u9664\u74f6\u9888\u3002\u5f00\u521b\u4ee5\u5ba2\u6237\u4e3a\u4e2d\u5fc3\u7684\u8fd0\u8425\u6846\u67b6\u3002\u9886\u5bfc\u8de8\u529f\u80fd\u56e2\u961f\u9879\u76ee\u4fc3\u8fdb\u8fd0\u8425\u5353\u8d8a\u3002\u5efa\u7acbKPI\u770b\u677f\u652f\u6301\u6570\u636e\u9a71\u52a8\u51b3\u7b56\u3002",
  "exp.1.role": "\u5ba2\u6237\u6210\u529f\u5de5\u7a0b\u5e08",
  "exp.1.company": "Fairventures Digital GmbH",
  "exp.1.period": "2023\u5e745\u6708 \u2013 2024\u5e745\u6708",
  "exp.1.desc": "\u8fdb\u884c\u73b0\u573a\u8bbf\u95ee\u8bc4\u4f30TREEO\u6280\u672f\u7528\u6237\u4f53\u9a8c\u3002\u76d1\u63a7TREEO\u4e91\u5e73\u53f0\u6bcf\u65e5\u6d3b\u52a8\u3002\u63d0\u5347TREEO\u5e94\u7528UI/UX\u3002\u63d0\u4f9b\u5168\u9762\u7528\u6237\u652f\u6301\u548c\u57f9\u8bad\u3002",
  "exp.2.role": "\u521d\u7ea7Android\u5f00\u53d1\u8005",
  "exp.2.company": "CV Kusuma Wijaya",
  "exp.2.period": "2022\u5e7410\u6708 \u2013 2023\u5e744\u6708",
  "exp.2.desc": "\u4f7f\u7528Android Studio\u548cKotlin/Java\u6784\u5efaAndroid\u5e94\u7528\u3002\u521b\u5efa\u79fb\u52a8\u548c\u7f51\u9875\u5e94\u7528\u539f\u578b\u3002",
  "exp.3.role": "HPPS\u9879\u76ee\u534f\u8c03\u5458\u52a9\u7406",
  "exp.3.company": "Fairventures Worldwide gGmbH",
  "exp.3.period": "2022\u5e742\u6708 \u2013 2023\u5e743\u6708",
  "exp.3.desc": "\u51c6\u5907\u6570\u636e\u6d41\u548c\u5b89\u5168\u6750\u6599\u3002\u7ba1\u7406\u6570\u636e\u91c7\u96c6\u548c\u5904\u7406\u3002\u786e\u4fdd\u6240\u6709\u5458\u5de5\u9075\u5b88\u5b89\u5168\u89c4\u7a0b\u3002",
  "exp.4.role": "\u7efc\u5408\u4e8b\u52a1\u4e13\u5458",
  "exp.4.company": "Fairventures Worldwide gGmbH",
  "exp.4.period": "2019\u5e7410\u6708 \u2013 2022\u5e742\u6708",
  "exp.4.desc": "\u7ba1\u7406\u529e\u516c\u5ba4\u5408\u540c\u548c\u8d44\u4ea7\u4ea4\u63a5\u3002\u534f\u8c03\u4fdd\u5b89\u548c\u53f8\u673a\u8fd0\u8425\u3002\u7ef4\u62a4\u56db\u8f86\u8f66\u8f86\u3002\u8ddf\u8e2a\u516c\u53f8\u6240\u6709\u8d44\u4ea7\u3002",
  "exp.5.role": "\u6f14\u793a\u4e13\u5458",
  "exp.5.company": "CV Karya Hidup Sentosa",
  "exp.5.period": "2019\u5e747\u6708 \u2013 2019\u5e749\u6708",
  "exp.5.desc": "\u5904\u7406B2B\u6c9f\u901a\u3002\u5728\u82cf\u95e8\u7b54\u62c9\u3001\u82cf\u62c9\u97e6\u897f\u548c\u52c3\u7f57\u6d32\u7684\u6cb9\u6930\u79cd\u690d\u56ed\u6f14\u793aQuick Tractor\u4ea7\u54c1\u3002",
  "exp.6.role": "\u5b9e\u4e60\u751f",
  "exp.6.company": "Badan Pusat Statistik (\u7edf\u8ba1\u5c40)",
  "exp.6.period": "2018\u5e747\u6708 \u2013 2018\u5e7412\u6708",
  "exp.6.desc": "\u8bbe\u8ba1\u5e74\u5ea6\u62a5\u544a\u4e66\u5c01\u9762\u3002\u4e3a\u5e74\u5ea6\u62a5\u544a\u521b\u4f5c\u6d77\u62a5\u548c\u77e2\u91cf\u56fe\u5f62\u3002",
  "skills.title": "\u6280\u80fd",
  "skills.subtitle": "\u6211\u7684\u4e13\u957f",
  "skills.management": "\u7ba1\u7406",
  "skills.management_items": "\u7ba1\u7406\u3001\u89e3\u51b3\u95ee\u9898\u3001\u6c9f\u901a\u3001\u9886\u5bfc\u529b",
  "skills.technical": "\u6280\u672f",
  "skills.technical_items": "\u79fb\u52a8\u8f6f\u4ef6\u5f00\u53d1\u3001GIS\u57fa\u7840\u3001\u7f51\u9875\u5f00\u53d1\u3001\u6570\u636e\u5206\u6790\u3001\u8f6f\u4ef6\u81ea\u52a8\u5316",
  "skills.languages": "\u8bed\u8a00",
  "skills.lang.en": "\u82f1\u8bed\uff08\u4e13\u4e1a\u5de5\u4f5c\u7ea7\u522b\uff09",
  "skills.lang.id": "\u5370\u5ea6\u5c3c\u897f\u4e9a\u8bed\uff08\u6bcd\u8bed\uff09",
  "skills.lang.nl": "\u8377\u5170\u8bed\uff08\u5165\u95e8\uff09",
  "skills.lang.zh": "\u666e\u901a\u8bdd\uff08\u5165\u95e8\uff09",
  "education.title": "\u6559\u80b2",
  "education.subtitle": "\u6211\u7684\u5b66\u4e60\u4e4b\u8def",
  "edu.0.school": "Binar Academy",
  "edu.0.major": "\u6570\u636e\u79d1\u5b66\u8bad\u7ec3\u8425",
  "edu.0.period": "2023\u5e746\u6708 \u2013 2023\u5e7411\u6708",
  "edu.1.school": "Binar Academy",
  "edu.1.major": "\u79fb\u52a8\u8f6f\u4ef6\u5de5\u7a0b\u8bad\u7ec3\u8425",
  "edu.1.period": "2022\u5e7412\u6708 \u2013 2023\u5e745\u6708",
  "edu.2.school": "\u62db\u724c\u5927\u5b66 (Universitas Terbuka)",
  "edu.2.major": "\u5546\u4e1a\u7ba1\u7406 (\u672c\u79d1)",
  "edu.2.period": "2020\u5e74 \u2013 \u73b0\u5728",
  "edu.3.school": "SMKN 1 Sampit",
  "edu.3.major": "\u4fe1\u606f\u6280\u672f\u5de5\u7a0b",
  "edu.3.period": "2017\u5e747\u6708 \u2013 2019\u5e748\u6708",
  "contact.title": "\u8054\u7cfb",
  "contact.subtitle": "\u8ba9\u6211\u4eec\u8fde\u63a5",
  "contact.name": "\u59d3\u540d",
  "contact.email": "\u90ae\u7bb1",
  "contact.message": "\u7559\u8a00",
  "contact.send": "\u53d1\u9001\u6d88\u606f",
  "contact.info_title": "\u8054\u7cfb\u4fe1\u606f",
  "contact.phone": "(+62) 812 5008 8282",
  "contact.email_addr": "mardiansyah.gunting@gmail.com",
  "contact.location": "\u5370\u5ea6\u5c3c\u897f\u4e9a\u5df4\u52b3\u6d3b\u7279",
  "contact.ref_title": "\u53c2\u8003\u4eba",
  "contact.ref1": "Dr. Sebastian Lenz \u2013 \u9ad8\u7ea7\u987e\u95ee, Future Camp",
  "contact.ref1_phone": "+491733713510",
  "contact.ref2": "Owen James \u2013 \u6295\u8d44\u987e\u95ee, Austrade",
  "contact.ref2_phone": "+61450961522",
  "footer.copyright": "\u00a9 2024 Mardiansyah Gunting. \u7248\u6743\u6240\u6709\u3002",
  "theme.light": "\u6e05\u4eae",
  "theme.dark": "\u6df1\u8272"
}
```

The i18n toggle logic is inlined in BaseLayout and Header components (see Tasks 4 and 5). No separate JS file needed.

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

### Task 5: Header Component (Navigation + Language Switcher + Theme Toggle)

**Files:**
- Create: `src/components/Header.astro`

**Interfaces:**
- Consumes: global CSS, i18n script
- Produces: fixed header rendered on all pages

- [ ] **Step 1: Create Header.astro**

```astro
---
const navItems = [
  { key: 'home', href: '#home' },
  { key: 'about', href: '#about' },
  { key: 'experience', href: '#experience' },
  { key: 'skills', href: '#skills' },
  { key: 'education', href: '#education' },
  { key: 'contact', href: '#contact' },
];
---

<header class="header">
  <div class="header-inner container">
    <a href="#home" class="logo" data-i18n="hero.name">Mardiansyah Gunting</a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        {navItems.map(item => (
          <li><a href={item.href} class="nav-link" data-i18n={`nav.${item.key}`}>{item.key}</a></li>
        ))}
      </ul>
    </nav>
    <div class="header-actions">
      <div class="lang-switch">
        <button class="lang-btn" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="id">ID</button>
        <button class="lang-btn" data-lang="zh">中文</button>
      </div>
      <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">🌙</button>
      <button id="menuToggle" class="menu-btn" aria-label="Toggle menu">☰</button>
    </div>
  </div>
</header>

<script>
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.__setLanguage(btn.dataset.lang);
    });
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('nav').classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('nav').classList.remove('open');
    });
  });
</script>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    transition: background 0.3s;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary);
    white-space: nowrap;
  }

  .logo:hover {
    text-decoration: none;
  }

  .nav-list {
    display: flex;
    list-style: none;
    gap: 1.75rem;
  }

  .nav-link {
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .nav-link:hover {
    color: var(--accent);
    text-decoration: none;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .lang-switch {
    display: flex;
    gap: 0.25rem;
  }

  .lang-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s;
  }

  .lang-btn:hover {
    color: var(--primary);
    border-color: var(--primary);
  }

  .theme-btn, .menu-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem;
  }

  .menu-btn {
    display: none;
  }

  @media (max-width: 768px) {
    .nav {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 1rem;
      transform: translateY(-100%);
      opacity: 0;
      transition: all 0.3s;
      pointer-events: none;
    }

    .nav.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    .nav-list {
      flex-direction: column;
      gap: 1rem;
    }

    .menu-btn {
      display: inline-block;
    }
  }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

### Task 6: Hero Section

**Files:**
- Create: `src/components/Hero.astro`

**Interfaces:**
- Consumes: global CSS classes, i18n `data-i18n` attributes
- Produces: full-viewport hero section

- [ ] **Step 1: Create Hero.astro**

```astro
<section id="home" class="hero">
  <div class="hero-content container">
    <div class="hero-badge" data-i18n="hero.tagline">Dependable Task Manager | Eager Learner</div>
    <h1 class="hero-name" data-i18n="hero.name">Mardiansyah Gunting</h1>
    <p class="hero-subtitle" data-i18n="hero.subtitle">Project Management · AI · Operational Excellence</p>
    <div class="hero-actions">
      <a href="#contact" class="btn btn-primary" data-i18n="hero.cta_contact">Get in Touch</a>
      <a href="#" class="btn btn-outline" data-i18n="hero.cta_cv">Download CV</a>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 64px;
  }

  .hero-content {
    max-width: 800px;
  }

  .hero-badge {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
  }

  .hero-name {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    color: var(--primary);
    line-height: 1.1;
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    color: var(--text-muted);
    margin-bottom: 2.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
```

- [ ] **Step 2: Verify build**

### Task 7: About Section

**Files:**
- Create: `src/components/About.astro`

- [ ] **Step 1: Create About.astro**

```astro
<section id="about" class="section">
  <div class="container">
    <div class="section-title" data-i18n="about.title">About Me</div>
    <div class="section-subtitle" data-i18n="about.subtitle">Who I Am</div>
    <div class="about-grid">
      <div class="about-avatar">
        <div class="avatar-placeholder">MG</div>
      </div>
      <div>
        <p class="about-text" data-i18n="about.body">
          I am a result-driven professional with a strong foundation in Project Management...
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 3rem;
    align-items: center;
  }

  .avatar-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: 700;
    color: #fff;
  }

  .about-text {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--text);
  }

  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .avatar-placeholder {
      margin: 0 auto;
    }
  }
</style>
```

### Task 8: Experience Timeline

**Files:**
- Create: `src/components/Experience.astro`

- [ ] **Step 1: Create Experience.astro**

```astro
---
const experiences = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
  { index: 3 },
  { index: 4 },
  { index: 5 },
  { index: 6 },
];
---

<section id="experience" class="section section-alt">
  <div class="container">
    <div class="section-title" data-i18n="experience.title">Experience</div>
    <div class="section-subtitle" data-i18n="experience.subtitle">My Professional Journey</div>
    <div class="timeline">
      {experiences.map(exp => (
        <div class="timeline-item fade-in">
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div class="timeline-period" data-i18n={`exp.${exp.index}.period`}></div>
            <h3 class="timeline-role" data-i18n={`exp.${exp.index}.role`}></h3>
            <div class="timeline-company" data-i18n={`exp.${exp.index}.company`}></div>
            <p class="timeline-desc" data-i18n={`exp.${exp.index}.desc`}></p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .timeline {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
    padding-left: 2rem;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border);
  }

  .timeline-item {
    position: relative;
    padding-bottom: 2.5rem;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-dot {
    position: absolute;
    left: -2rem;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent);
    border: 3px solid var(--bg);
    z-index: 1;
  }

  .timeline-card {
    background: var(--bg);
    padding: 1.25rem 1.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    transition: box-shadow 0.2s;
  }

  .timeline-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .timeline-period {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.25rem;
  }

  .timeline-role {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.15rem;
  }

  .timeline-company {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .timeline-desc {
    font-size: 0.9rem;
    color: var(--text);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .timeline {
      padding-left: 1.5rem;
    }

    .timeline-dot {
      left: -1.5rem;
      width: 12px;
      height: 12px;
    }
  }
</style>
```

### Task 9: Skills Section

**Files:**
- Create: `src/components/Skills.astro`

- [ ] **Step 1: Create Skills.astro**

```astro
<section id="skills" class="section">
  <div class="container">
    <div class="section-title" data-i18n="skills.title">Skills</div>
    <div class="section-subtitle" data-i18n="skills.subtitle">What I Bring</div>
    <div class="skills-grid">
      <div class="skill-group fade-in">
        <h3 class="skill-group-title" data-i18n="skills.management">Management</h3>
        <div class="skill-tags" data-i18n="skills.management_items"></div>
      </div>
      <div class="skill-group fade-in">
        <h3 class="skill-group-title" data-i18n="skills.technical">Technical</h3>
        <div class="skill-tags" data-i18n="skills.technical_items"></div>
      </div>
      <div class="skill-group fade-in">
        <h3 class="skill-group-title" data-i18n="skills.languages">Languages</h3>
        <div class="skill-tags">
          <span class="tag" data-i18n="skills.lang.en"></span>
          <span class="tag" data-i18n="skills.lang.id"></span>
          <span class="tag" data-i18n="skills.lang.nl"></span>
          <span class="tag" data-i18n="skills.lang.zh"></span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .skill-group-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: var(--bg-alt);
    color: var(--text);
    padding: 0.4rem 0.85rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--border);
  }
</style>
```

### Task 10: Education Section

**Files:**
- Create: `src/components/Education.astro`

- [ ] **Step 1: Create Education.astro**

```astro
---
const eduItems = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
  { index: 3 },
];
---

<section id="education" class="section section-alt">
  <div class="container">
    <div class="section-title" data-i18n="education.title">Education</div>
    <div class="section-subtitle" data-i18n="education.subtitle">My Learning Path</div>
    <div class="edu-grid">
      {eduItems.map(item => (
        <div class="edu-card fade-in">
          <div class="edu-period" data-i18n={`edu.${item.index}.period`}></div>
          <h3 class="edu-school" data-i18n={`edu.${item.index}.school`}></h3>
          <div class="edu-major" data-i18n={`edu.${item.index}.major`}></div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .edu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .edu-card {
    background: var(--bg);
    padding: 1.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }

  .edu-period {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .edu-school {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }

  .edu-major {
    font-size: 0.9rem;
    color: var(--text-muted);
  }
</style>
```

### Task 11: Contact Section + Footer

**Files:**
- Create: `src/components/Contact.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Contact.astro**

```astro
<section id="contact" class="section">
  <div class="container">
    <div class="section-title" data-i18n="contact.title">Contact</div>
    <div class="section-subtitle" data-i18n="contact.subtitle">Let's Connect</div>
    <div class="contact-grid">
      <div class="contact-form fade-in">
        <input type="text" class="input" data-i18n-placeholder="contact.name" placeholder="Name" />
        <input type="email" class="input" data-i18n-placeholder="contact.email" placeholder="Email" />
        <textarea class="input textarea" rows="5" data-i18n-placeholder="contact.message" placeholder="Message"></textarea>
        <button class="btn btn-primary" data-i18n="contact.send">Send Message</button>
      </div>
      <div class="contact-info fade-in">
        <h3 class="contact-info-title" data-i18n="contact.info_title">Contact Info</h3>
        <div class="contact-item">
          <strong>Email:</strong>
          <span data-i18n="contact.email_addr"></span>
        </div>
        <div class="contact-item">
          <strong>Phone:</strong>
          <span data-i18n="contact.phone"></span>
        </div>
        <div class="contact-item">
          <strong>Location:</strong>
          <span data-i18n="contact.location"></span>
        </div>
        <h3 class="contact-ref-title" data-i18n="contact.ref_title">References</h3>
        <div class="contact-item">
          <span data-i18n="contact.ref1"></span><br/>
          <small data-i18n="contact.ref1_phone"></small>
        </div>
        <div class="contact-item">
          <span data-i18n="contact.ref2"></span><br/>
          <small data-i18n="contact.ref2_phone"></small>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-family: var(--font-sans);
    font-size: 0.95rem;
    background: var(--bg);
    color: var(--text);
    transition: border-color 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .textarea {
    resize: vertical;
    min-height: 120px;
  }

  .contact-info-title, .contact-ref-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  .contact-ref-title {
    margin-top: 2rem;
  }

  .contact-item {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: var(--text);
  }

  .contact-item small {
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create Footer.astro**

```astro
<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <p data-i18n="footer.copyright">&copy; 2024 Mardiansyah Gunting. All rights reserved.</p>
      <div class="footer-links">
        <a href="https://github.com/mardiansyah-gunting" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border);
    padding: 2rem 0;
  }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .footer-links {
    display: flex;
    gap: 1rem;
  }

  .footer-links a {
    color: var(--text-muted);
  }

  .footer-links a:hover {
    color: var(--accent);
  }

  @media (max-width: 768px) {
    .footer-inner {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }
</style>
```

### Task 12: Main Index Page (Assembly)

**Files:**
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: all components and layout

- [ ] **Step 1: Create index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Skills from '../components/Skills.astro';
import Education from '../components/Education.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout>
  <Header />
  <main>
    <Hero />
    <About />
    <Experience />
    <Skills />
    <Education />
    <Contact />
  </main>
  <Footer />

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  </script>
</BaseLayout>
```

- [ ] **Step 2: Final build verification**

Run: `npm run build`
Expected: Clean build with no errors.

### Task 13: GitHub Actions Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create .gitignore**

Create/modify `.gitignore`:
```
node_modules/
dist/
.env
.DS_Store
```

- [ ] **Step 3: Commit all files**

```bash
git add -A
git commit -m "feat: initial portfolio website"
```

- [ ] **Step 4: Push to GitHub**

```bash
git push origin main
```
