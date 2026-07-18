# Portfolio Web

Personal portfolio website built with [Astro](https://astro.build). Features a clean, responsive design with multi-language support (EN, ID, ZH).

## Features

- Multi-language i18n (English, Indonesian, Mandarin)
- Responsive layout (desktop & mobile)
- Floating navigation pill with glassmorphism
- Scroll-triggered fade-in animations
- Dark/light theme (light-only currently active)
- Contact form → opens default email client
- SEO-friendly static output

## Tech Stack

- **Framework:** [Astro](https://astro.build) (static site generator)
- **Styling:** Vanilla CSS with CSS custom properties
- **Deployment:** GitHub Pages

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # Astro components (Header, Hero, About, etc.)
├── layouts/        # Base layout
├── pages/          # Route pages
├── styles/         # Global CSS
public/
├── i18n/           # Translation JSON files (en, id, zh)
└── profile.jpg     # Profile photo
```

## Deployment

The site is deployed to GitHub Pages via GitHub Actions. Pushing to `main` triggers an automatic build and deploy.
