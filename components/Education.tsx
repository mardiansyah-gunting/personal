"use client";

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useSite } from "./SiteProvider";

/** Plain list in the accordion's line style — nothing to expand. */
export function Education() {
  const { education, ui } = useSite();
  return (
    <section id="education" className="content-width section-gap">
      <SectionHeader title={ui.sections.education} id="education" />
      <ol className="border-b border-line">
        {education.map((e, i) => (
          <Reveal key={`${e.school}-${e.period}`} delay={i * 70} data-board={`edu-${i}`}>
            <li className="grid grid-cols-[54px_1fr] border-t border-line py-4">
              <span className="pt-[3px] text-[15px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-[18px] leading-[1.3]">{e.school}</h3>
                <p className="text-muted">{e.programme}</p>
                <p className="text-[15px] text-muted">
                  {e.period}
                  {e.grade && <> · {e.grade}</>}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
