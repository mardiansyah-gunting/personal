"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { SectionHeader } from "./SectionHeader";
import { IconChevron } from "./Icons";
import { Reveal } from "./Reveal";

export function Services() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="services" className="content-width section-gap">
      <SectionHeader title="Services" id="services" />
      <div className="services border-b border-line">
        {site.services.map((s, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={s.title} delay={i * 70} data-board={`service-${i}`}>
              <div className={`service-row border-t border-line ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="grid w-full grid-cols-[54px_1fr_20px] items-center py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-[13px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[15px] font-medium leading-[1.3]">{s.title}</h3>
                  <IconChevron size={16} className="service-chevron text-muted" />
                </button>
                <div id={`svc-${i}`} className="service-panel" role="region">
                  <div className="overflow-hidden">
                    <p className="max-w-[420px] pb-5 pl-[54px] text-muted">{s.text}</p>
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
