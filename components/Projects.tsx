"use client";

import { CardRail } from "./CardRail";
import { IconExternal } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useSheet } from "./SheetProvider";
import { useSite } from "./SiteProvider";
import { Visual } from "./visuals/Visual";

export function Projects() {
  const { projects, moreProjectsHref, ui } = useSite();
  const { open } = useSheet();
  const items = [
    ...projects.map((p) => ({
      key: p.slug,
      label: `${p.title}, ${p.kind}`,
      node: (
        <>
          <span data-card-media className={`relative block aspect-[3/2] overflow-hidden rounded-lg ${p.portrait ? "" : "bg-tile"}`}>
            <Visual visual={p.cover} bare={p.portrait} />
          </span>
          <span className="card-foot mt-3 flex items-baseline justify-between gap-4 text-[16px]">
            <span>{p.title}</span>
            <span className="text-right text-muted">{p.kind}</span>
          </span>
        </>
      ),
    })),
    {
      key: "more",
      label: `${ui.moreProjects} (${ui.opensNewTab})`,
      node: (
        <>
          <span data-card-media className="relative grid aspect-[3/2] place-items-center overflow-hidden rounded-lg bg-tile px-8 text-center">
            <span className="text-[22px] leading-snug">{ui.moreProjects}</span>
          </span>
          <span className="card-foot mt-3 flex items-baseline justify-between text-[16px]">
            <span>GitHub</span>
            <IconExternal size={15} className="text-muted" />
          </span>
        </>
      ),
    },
  ];

  return (
    <section id="projects" className="content-width section-gap">
      <SectionHeader title={ui.sections.projects} id="projects" />
      <Reveal data-board="projects-rail">
        <CardRail
          label={ui.sections.projects}
          cardW="min(540px, 84vw)"
          onOpen={(i, el) => {
            if (i === projects.length) {
              window.open(moreProjectsHref, "_blank", "noopener,noreferrer");
              return;
            }
            open({ type: "project", slug: projects[i].slug }, el.querySelector<HTMLElement>("[data-card-media]") ?? el);
          }}
          items={items}
        />
      </Reveal>
    </section>
  );
}
