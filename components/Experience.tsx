"use client";

import { CardRail } from "./CardRail";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { Highlighted, useSheet } from "./SheetProvider";
import { useSite } from "./SiteProvider";

/** One paper "document" per role, newest first; opening one grows its sheet. */
export function Experience() {
  const { experience, ui } = useSite();
  const { open } = useSheet();
  return (
    <section id="experience" className="content-width section-gap">
      <SectionHeader title={ui.sections.experience} id="experience" />
      <Reveal>
        <CardRail
          label={ui.sections.experience}
          cardW="min(340px, 78vw)"
          gap={40}
          onOpen={(i, el) => open({ type: "experience", slug: experience[i].slug }, el.querySelector<HTMLElement>(".doc-page") ?? el)}
          items={experience.map((e) => ({
            key: e.slug,
            label: `${e.role}, ${e.company}, ${e.period}`,
            node: (
              <>
                <span className="block h-[440px] max-h-[118vw]">
                  <span className="doc-page block text-left">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.logo} alt="" width={36} height={36} loading="lazy" className="mb-4 h-9 w-9 rounded-md object-contain" />
                    <span className="block text-[22px] leading-[1.15]">{e.role}</span>
                    <span className="mt-2 block text-[14px] text-[#666]">{e.period}</span>
                    <span className="block text-[14px] text-[#666]">{e.company}</span>
                    <span className="mt-6 block space-y-3">
                      {e.body.map((b, i) => (
                        <span key={i} className={`block ${i ? "text-[#666]" : ""}`}>
                          <Highlighted text={b} />
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
                <span className="card-foot mt-3 flex items-baseline justify-between gap-4 text-[16px]">
                  <span className="truncate text-muted">{e.company}</span>
                  <span className="shrink-0 text-muted">{ui.readMore}</span>
                </span>
              </>
            ),
          }))}
        />
      </Reveal>
    </section>
  );
}
