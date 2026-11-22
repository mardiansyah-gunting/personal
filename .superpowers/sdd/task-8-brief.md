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

