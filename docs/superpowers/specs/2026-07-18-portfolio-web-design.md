# Portfolio Website - Mardiansyah Gunting

## Overview

Single-page portfolio website for Mardiansyah Gunting, positioning as a forward-looking generalist with strengths in Project Management and AI. The site communicates adaptability, operational excellence, and a technology-driven mindset.

## Tech Stack

- **Framework:** Astro (static site generation)
- **Styling:** CSS custom properties, no framework (lightweight)
- **i18n:** JSON translation files (`src/i18n/{en,id,zh}.json`) + localStorage
- **Animations:** Native Intersection Observer (fade-in-up on scroll)
- **Deployment:** GitHub Pages via GitHub Actions
- **Font:** Inter (system font fallback)

## Languages

- English (default), Indonesian, Chinese (Mandarin)
- Toggle via header UI, persisted in localStorage
- No page reload on switch

## Color System

| Token              | Hex       | Usage                        |
|--------------------|-----------|------------------------------|
| `--primary`        | `#0f2b4c` | Navbar, headings, buttons    |
| `--primary-light`  | `#1e4d7a` | Hover states                 |
| `--accent`         | `#3b82f6` | Links, timeline dots, icons  |
| `--bg`             | `#ffffff` | Main background              |
| `--bg-alt`         | `#f1f5f9` | Alternating sections         |
| `--text`           | `#1e293b` | Body text                    |
| `--text-muted`     | `#64748b` | Secondary text               |

Dark mode inverts: `--bg → #0f172a`, `--bg-alt → #1e293b`, `--text → #f1f5f9`, etc.

## Layout & Sections

### Header (fixed)
- Name/logo left
- Language switcher (EN | ID | 中文) center
- Dark mode toggle right
- Mobile: hamburger menu

### 1. Hero (full viewport)
- Large name: **Mardiansyah Gunting**
- Tagline: "Dependable Task Manager | Eager Learner"
- Subtitle: "Project Management · AI · Operational Excellence"
- CTAs: "Get in Touch" (scroll to contact), "Download CV"

### 2. About Me
- 2-column: placeholder avatar + bio
- Bio text: generalist bridging Project Management and AI, adaptability, operational excellence
- Slight left/right layout on desktop, stacked on mobile

### 3. Experience (timeline)
- Vertical timeline with dots and connecting line
- 7 entries, newest first:
  1. Fairventures Digital GmbH — Operation Manager (May 2024–Present)
  2. Fairventures Digital GmbH — Customer Success Engineer (May 2023–May 2024)
  3. CV Kusuma Wijaya — Junior Android Developer (Oct 2022–Apr 2023)
  4. Fairventures Worldwide gGmbH — HPPS Project Coordinator Assistant (Feb 2022–Mar 2023)
  5. Fairventures Worldwide gGmbH — General Affairs Officer (Oct 2019–Feb 2022)
  6. CV Karya Hidup Sentosa — Demonstration Officer (Jul 2019–Sep 2019)
  7. Badan Pusat Statistik — Intern (Jul 2018–Dec 2018)
- Hover/click expands detail
- On mobile: timeline becomes list

### 4. Skills
- Badge grid (no progress bars)
- Categories:
  - **Management:** Management, Problem-solving, Communication, Leadership
  - **Technical:** Mobile Software Development, Basic GIS, Web Development, Data Analysis, Software Automation
  - **Languages:** English (Professional), Indonesian (Native), Dutch (Beginner), Mandarin (Beginner)

### 5. Education
- Card list:
  - Binar Academy — Data Science Bootcamp (Jun–Nov 2023)
  - Binar Academy — Mobile Software Engineering Bootcamp (Dec 2022–May 2023)
  - Universitas Terbuka — Business Management, Undergraduate (2020–Present)
  - SMKN 1 Sampit — Information Technology Engineering, Vocational (Jul 2017–Aug 2019)

### 6. Contact
- Left: contact form (name, email, message) — static/no backend
- Right: email, location
- References section at bottom (Dr. Sebastian Lenz, Owen James)

### Footer
- Copyright, GitHub link, social links

## Deployment

- GitHub Actions workflow: `on push to main` → build with `astro build` → deploy `dist/` folder to GitHub Pages
- Domain: via GitHub Pages default URL or custom domain later

## Future Enhancements (out of scope for v1)

- Blog section
- CMS integration
- Contact form backend (formspree or similar)
- Downloadable PDF CV
