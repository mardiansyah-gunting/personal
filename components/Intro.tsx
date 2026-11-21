"use client";

import { Reveal } from "./Reveal";
import { RichText } from "./RichText";
import { SectionHeader } from "./SectionHeader";
import { useSite } from "./SiteProvider";

/** "Now" statement + products line */
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

      <Reveal data-board="products" className="mt-16">
        <p className="max-w-[540px] text-[24px] leading-[1.3] sm:text-[26px]">
          <RichText segs={productsLine} />
        </p>
      </Reveal>
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
