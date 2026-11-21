"use client";

import { useState } from "react";
import { IconChevron } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useSite } from "./SiteProvider";

/** Numbered accordion: skill groups, languages, and how often each strength shows up. */
export function Skills() {
  const { skills, ui } = useSite();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="skills" className="content-width section-gap">
      <SectionHeader title={ui.sections.skills} id="skills" />
      <div className="services border-b border-line">
        {skills.map((s, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={s.title} delay={i * 70}>
              <div className={`service-row border-t border-line ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="grid w-full grid-cols-[54px_1fr_20px] items-center py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`skill-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-[15px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[18px] leading-[1.3]">{s.title}</h3>
                  <IconChevron size={16} className="service-chevron text-muted" />
                </button>
                <div id={`skill-${i}`} className="service-panel" role="region" aria-label={s.title}>
                  <div className="overflow-hidden">
                    <p className="max-w-[440px] pb-5 pl-[54px] text-muted">{s.text}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
