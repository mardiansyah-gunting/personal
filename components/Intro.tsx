"use client";

import type { PointerEvent as RPointerEvent } from "react";
import type { Organization } from "@/content/types";
import { IconExternal } from "./Icons";
import { Reveal } from "./Reveal";
import { RichText } from "./RichText";
import { SectionHeader } from "./SectionHeader";
import { useSite } from "./SiteProvider";

/** "Now" statement + organisation tiles + products line */
export function Intro() {
  const { lang, now, organizations, productsLine, ui } = useSite();
  const treeo = organizations[0];
  return (
    <section className="content-width section-gap">
      <div id="now">
        <SectionHeader title={ui.sections.now} id="now" />
        <Reveal data-board="now-text">
          <p className="leading-[1.5]">
            {now.lead} <CompanyBadge name={now.company} logo={treeo.logo} />
            {lang === "zh" ? "。" : "."}
            <br />
            {now.rest}
          </p>
          {now.about.map((t, i) => (
            <p key={i} className="mt-5 text-muted">
              {t}
            </p>
          ))}
        </Reveal>
      </div>

      <div id="organizations" className="mt-24 scroll-mt-24">
        <SectionHeader title={ui.sections.organizations} id="organizations" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {organizations.map((o, i) => (
            <Reveal key={o.slug} delay={i * 90} data-board={`org-${o.slug}`}>
              <OrgTile org={o} newTab={ui.opensNewTab} />
            </Reveal>
          ))}
        </div>
        <Reveal data-board="products" className="mt-16">
          <p className="max-w-[540px] text-[24px] leading-[1.3] sm:text-[26px]">
            <RichText segs={productsLine} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Inline logo + name for the "Now" sentence. */
function CompanyBadge({ name, logo }: { name: string; logo: string }) {
  return (
    <span className="inline-flex translate-y-[2px] items-center gap-1.5 align-baseline">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
      <span className="font-bold tracking-[0.18em]">{name}</span>
    </span>
  );
}

function OrgTile({ org, newTab }: { org: Organization; newTab: string }) {
  const onMove = (e: RPointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <a
      href={org.href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onMove}
      className="company-tile group block"
      aria-label={`${org.name} — ${org.note} (${newTab})`}
    >
      <span className="company-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={org.logo} alt="" loading="lazy" className="max-h-[46%] max-w-[46%] object-contain mix-blend-multiply" />
        <IconExternal size={16} className="absolute right-3 top-3 text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      </span>
      <span className="mt-2 block text-[16px] leading-snug">{org.name}</span>
      <span className="block text-[15px] leading-snug text-muted">{org.note}</span>
    </a>
  );
}
