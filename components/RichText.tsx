"use client";

import { Fragment, type ReactNode } from "react";
import type { Seg } from "@/content/types";
import { toGroups, toUnits, type Unit } from "@/lib/richText";
import { useSheet } from "./SheetProvider";

/**
 * Renders rich text. With `animate`, every word fades from 15% → 100%
 * opacity with a small stagger (the hero "word reveal").
 * Links never get separated from trailing punctuation (wrapped in nowrap groups).
 */
export function RichText({ segs, animate = false, startDelay = 120, step = 38 }: { segs: Seg[]; animate?: boolean; startDelay?: number; step?: number }) {
  const { open } = useSheet();
  const groups = toGroups(toUnits(segs));

  let i = 0;
  const anim = () => (animate ? { className: "word", style: { animationDelay: `${startDelay + i++ * step}ms` } } : {});

  const renderUnit = (u: Unit, key: number): ReactNode => {
    if (u.kind === "space") return " ";
    if (u.kind === "break") return null;
    if (u.kind === "word") {
      const a = anim();
      return (
        <span key={key} {...a}>
          {u.text}
        </span>
      );
    }
    const a = anim();
    const { seg } = u;
    const cls = `hand-link ${a.className ?? ""}`;
    if (seg.project || seg.experience) {
      return (
        <button
          key={key}
          type="button"
          className={`${cls} cursor-pointer`}
          style={a.style}
          onClick={(e) => open(seg.project ? { type: "project", slug: seg.project } : { type: "experience", slug: seg.experience! }, e.currentTarget)}
        >
          {seg.text}
        </button>
      );
    }
    return (
      <a key={key} href={seg.href} className={cls} style={a.style} {...(seg.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {seg.text}
      </a>
    );
  };

  return (
    <>
      {groups.map((g, gi) =>
        g.length === 1 ? (
          <Fragment key={gi}>{renderUnit(g[0], gi)}</Fragment>
        ) : (
          <span key={gi} className="whitespace-nowrap">
            {g.map((u, ui) => renderUnit(u, ui))}
          </span>
        ),
      )}
    </>
  );
}
