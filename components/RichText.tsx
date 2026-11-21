"use client";

import { Fragment, type ReactNode } from "react";
import type { Seg } from "@/content/types";
import { useSheet } from "./SheetProvider";

type Unit = { kind: "space" } | { kind: "word"; text: string } | { kind: "link"; seg: Exclude<Seg, string> };

/** Splits segments into words/spaces/links so each word can animate on its own. */
function toUnits(segs: Seg[]): Unit[] {
  const out: Unit[] = [];
  for (const s of segs) {
    if (typeof s !== "string") {
      out.push({ kind: "link", seg: s });
      continue;
    }
    for (const tok of s.split(/(\s+)/)) {
      if (!tok) continue;
      out.push(/^\s+$/.test(tok) ? { kind: "space" } : { kind: "word", text: tok });
    }
  }
  return out;
}

/**
 * Renders rich text. With `animate`, every word fades from 15% → 100%
 * opacity with a small stagger (the hero "word reveal").
 * Links never get separated from trailing punctuation (wrapped in nowrap groups).
 */
export function RichText({ segs, animate = false, startDelay = 120, step = 38 }: { segs: Seg[]; animate?: boolean; startDelay?: number; step?: number }) {
  const { open } = useSheet();
  const units = toUnits(segs);

  // group consecutive non-space units so "Northwind," never breaks apart
  const groups: Unit[][] = [];
  let cur: Unit[] = [];
  for (const u of units) {
    if (u.kind === "space") {
      if (cur.length) groups.push(cur);
      groups.push([u]);
      cur = [];
    } else cur.push(u);
  }
  if (cur.length) groups.push(cur);

  let i = 0;
  const anim = () => (animate ? { className: "word", style: { animationDelay: `${startDelay + i++ * step}ms` } } : {});

  const renderUnit = (u: Unit, key: number): ReactNode => {
    if (u.kind === "space") return " ";
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
