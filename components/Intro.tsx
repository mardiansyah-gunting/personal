"use client";

import type { PointerEvent as RPointerEvent } from "react";
import { site } from "@/content/site";
import { SectionHeader } from "./SectionHeader";
import { RichText } from "./RichText";
import { Reveal } from "./Reveal";

/** "Now" statement + company tiles + products line */
export function Intro() {
  return (
    <section id="companies" className="content-width section-gap">
      <div id="now">
        <SectionHeader title="Now" id="now" />
        <Reveal data-board="now-text">
          <p className="leading-[1.5]">
            {site.now.lead} <CompanyBadge name={site.now.company} />.
            <br />
            {site.now.rest}
          </p>
        </Reveal>
      </div>

      <div className="mt-24">
        <SectionHeader title="Companies" id="companies" />
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {site.companies.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} data-board={`company-${i}`}>
              <CompanyTile {...c} />
            </Reveal>
          ))}
        </div>
        <Reveal data-board="products" className="mt-16">
          <p className="max-w-[540px] text-[21px] leading-[1.2] tracking-[-0.02em] sm:text-[24px] sm:leading-[1.18]">
            <RichText segs={site.productsLine} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Inline wordmark for the "Now" sentence — replace with your client's logo SVG. */
function CompanyBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex translate-y-[1px] items-center gap-1.5 align-baseline">
      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
        <circle cx="8" cy="8" r="6.2" fill="currentColor" />
        <path d="M1 8h14" stroke="var(--bg)" strokeWidth="1.6" />
      </svg>
      <span className="-mr-[0.32em] text-[12px] font-semibold tracking-[0.32em]">{name}</span>
    </span>
  );
}

function CompanyTile({ name, note, href, mark }: { name: string; note: string; href: string; mark: string }) {
  const onMove = (e: RPointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <a href={href} onPointerMove={onMove} className="company-tile group block" aria-label={`${name} — ${note}`}>
      <span className="company-mark text-ink">
        <Mark kind={mark} />
        <span className="absolute inset-x-3 bottom-3 flex items-baseline justify-between text-[13px] opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 translate-y-1 sm:inset-x-4 sm:bottom-4">
          <span>{name}</span>
          <span className="hidden text-muted sm:inline">{note}</span>
        </span>
      </span>
    </a>
  );
}

/** Placeholder logo marks. Replace with your own SVGs. */
function Mark({ kind }: { kind: string }) {
  if (kind === "northwind")
    return (
      <svg viewBox="0 0 80 80" className="w-[30%]" aria-hidden>
        <path d="M8 8h64v26a38 38 0 0 0-38 38H8z" fill="currentColor" />
        <circle cx="62" cy="62" r="7" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 80 80" className="w-[30%]" aria-hidden>
      <rect x="8" y="16" width="64" height="9" rx="4.5" fill="currentColor" />
      <rect x="8" y="35.5" width="46" height="9" rx="4.5" fill="currentColor" />
      <rect x="8" y="55" width="28" height="9" rx="4.5" fill="currentColor" />
      <circle cx="64" cy="59.5" r="6" fill="currentColor" />
    </svg>
  );
}
