"use client";

import { site } from "@/content/site";
import { CardRail } from "./CardRail";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useSheet, Highlighted } from "./SheetProvider";
import { Visual } from "./visuals/Visual";

export function Projects() {
  const { open } = useSheet();
  return (
    <section id="projects" className="content-width section-gap">
      <SectionHeader title="Projects" id="projects" />
      <Reveal data-board="projects-rail">
        <CardRail
          label="Projects"
          cardW="min(540px, 84vw)"
          onOpen={(i, el) => open({ type: "project", slug: site.projects[i].slug }, el.querySelector<HTMLElement>("[data-card-media]") ?? el)}
          items={site.projects.map((p) => ({
            key: p.slug,
            label: `${p.title}, ${p.year}`,
            node: (
              <>
                <span data-card-media className={`relative block aspect-[3/2] overflow-hidden rounded-lg ${p.portrait ? "" : "bg-tile"}`}>
                  <Visual visual={p.cover} bare={p.portrait} />
                </span>
                <span className="card-foot mt-3 flex items-baseline justify-between text-[14px]">
                  <span>{p.title}</span>
                  <span className="text-muted">{p.year}</span>
                </span>
              </>
            ),
          }))}
        />
      </Reveal>
    </section>
  );
}

export function Thoughts() {
  const { open } = useSheet();
  return (
    <section id="thoughts" className="content-width section-gap">
      <SectionHeader title="Thoughts" id="thoughts" />
      <Reveal data-board="thoughts-rail">
        <CardRail
          label="Thoughts"
          cardW="min(320px, 76vw)"
          gap={40}
          onOpen={(i, el) => open({ type: "post", slug: site.posts[i].slug }, el.querySelector<HTMLElement>(".doc-page") ?? el)}
          items={site.posts.map((p) => ({
            key: p.slug,
            label: `${p.title}, ${p.date}`,
            node: (
              <>
                <span className="block h-[416px] max-h-[110vw]">
                  <span className="doc-page block">
                    <span className="block text-[20px] font-medium leading-[1.15] tracking-[-0.02em]">{p.title}</span>
                    <span className="mt-2 block text-[12px] text-[#666]">{p.date}</span>
                    <span className="mt-7 block space-y-3">
                      {p.body.map((b, i) => (
                        <span key={i} className={`block ${i ? "text-[#666]" : ""}`}>
                          <Highlighted text={b} />
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
                <span className="card-foot mt-3 flex items-baseline justify-between text-[14px]">
                  <span className="text-muted">Read note</span>
                  <span className="text-muted">{Math.max(1, Math.round(p.body.join(" ").split(" ").length / 200))} min</span>
                </span>
              </>
            ),
          }))}
        />
      </Reveal>
    </section>
  );
}
