"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { site } from "@/content/site";
import { Visual } from "./visuals/Visual";
import { IconClose, IconDownload } from "./Icons";

export type SheetTarget = { type: "project" | "post"; slug: string };

type Ctx = { open: (t: SheetTarget, origin?: HTMLElement | null) => void; close: () => void; current: SheetTarget | null };
const SheetCtx = createContext<Ctx>({ open: () => {}, close: () => {}, current: null });
export const useSheet = () => useContext(SheetCtx);

const hashFor = (t: SheetTarget) => `#/${t.type === "project" ? "work" : "notes"}/${t.slug}`;
function parseHash(h: string): SheetTarget | null {
  const m = h.match(/^#\/(work|notes)\/([\w-]+)$/);
  if (!m) return null;
  const t: SheetTarget = { type: m[1] === "work" ? "project" : "post", slug: m[2] };
  const exists = t.type === "project" ? site.projects.some((p) => p.slug === t.slug) : site.posts.some((p) => p.slug === t.slug);
  return exists ? t : null;
}

/**
 * Detail "sheets" for projects and posts.
 * – Opens from the clicked card (clip-path morph) or slides up from the bottom.
 * – Deep-linkable: #/work/<slug> and #/notes/<slug>; the browser back button closes it.
 */
export function SheetProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<SheetTarget | null>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const animateClose = useCallback(() => {
    const el = sheetRef.current;
    if (!el || closingRef.current) return;
    closingRef.current = true;
    const origin = originRef.current;
    const r = origin?.getBoundingClientRect();
    const visible = r && r.bottom > 0 && r.top < innerHeight && r.width > 0;
    const anim = visible
      ? el.animate(
          [
            { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 },
            { clipPath: `inset(${r!.top}px ${innerWidth - r!.right}px ${innerHeight - r!.bottom}px ${r!.left}px round 8px)`, opacity: 0.4 },
          ],
          { duration: 420, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" },
        )
      : el.animate([{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], { duration: 420, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" });
    anim.onfinish = () => {
      closingRef.current = false;
      setCurrent(null);
      document.documentElement.classList.remove("has-sheet");
      origin?.focus?.({ preventScroll: true });
    };
  }, []);

  const open = useCallback((t: SheetTarget, origin?: HTMLElement | null) => {
    originRef.current = origin ?? null;
    setCurrent(t);
    document.documentElement.classList.add("has-sheet");
    if (location.hash !== hashFor(t)) {
      history.pushState({ sheet: true }, "", hashFor(t));
      pushedRef.current = true;
    }
  }, []);

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      history.back(); // popstate → animateClose
    } else {
      if (location.hash.startsWith("#/")) history.replaceState(null, "", location.pathname + location.search);
      animateClose();
    }
  }, [animateClose]);

  // deep links + back button
  useEffect(() => {
    const fromHash = parseHash(location.hash);
    if (fromHash) {
      setCurrent(fromHash);
      document.documentElement.classList.add("has-sheet");
    }
    const onPop = () => {
      const t = parseHash(location.hash);
      if (t) {
        originRef.current = null;
        setCurrent(t);
        document.documentElement.classList.add("has-sheet");
      } else animateClose();
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [animateClose]);

  // open animation
  useEffect(() => {
    const el = sheetRef.current;
    if (!current || !el) return;
    el.scrollTop = 0;
    const r = originRef.current?.getBoundingClientRect();
    if (r && r.width > 0) {
      el.animate(
        [
          { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 8px)` },
          { clipPath: "inset(0px 0px 0px 0px round 0px)" },
        ],
        { duration: 650, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
      );
    } else {
      el.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 600, easing: "cubic-bezier(0.32, 0.72, 0, 1)" });
    }
    el.querySelector<HTMLElement>("[data-sheet-body]")?.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 800, delay: 120, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" },
    );
    el.focus({ preventScroll: true });
  }, [current]);

  // Esc to close
  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [current, close]);

  return (
    <SheetCtx.Provider value={{ open, close, current }}>
      {children}
      {current &&
        createPortal(
          <div ref={sheetRef} className="sheet" role="dialog" aria-modal="true" tabIndex={-1} aria-label={current.slug}>
            <div data-sheet-body>{current.type === "project" ? <ProjectSheet slug={current.slug} /> : <PostSheet slug={current.slug} />}</div>
            <button className="sheet-close" onClick={close} aria-label="Close">
              <IconClose size={16} />
            </button>
          </div>,
          document.body,
        )}
    </SheetCtx.Provider>
  );
}

/* ───────────── sheet bodies ───────────── */

function ProjectSheet({ slug }: { slug: string }) {
  const p = site.projects.find((x) => x.slug === slug)!;
  return (
    <article className="pb-44">
      <div className="relative mx-auto mt-[6vh] aspect-[16/10] w-[min(1100px,92vw)] overflow-hidden rounded-xl bg-tile">
        <Visual visual={p.cover} />
      </div>
      <div className="content-width mt-16">
        <h3 className="text-[24px] leading-tight tracking-[-0.02em]">{p.title}</h3>
        <p className="text-muted">
          {p.kind} · {p.year}
        </p>
        <p className="mt-8">{p.summary}</p>
        {p.body.map((b, i) => (
          <p key={i} className="mt-4 text-muted">
            {b}
          </p>
        ))}
      </div>
      {p.gallery.map((g, i) => (
        <figure key={i} className="mx-auto mt-24 w-[min(900px,92vw)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-tile">
            <Visual visual={g.visual} />
          </div>
          <figcaption className="mt-3 text-center text-[13px] text-muted">{g.caption}</figcaption>
        </figure>
      ))}
      {p.cta && (
        <a
          href={p.cta.href}
          className="fixed bottom-[72px] left-1/2 z-[61] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#181818] px-4 py-2.5 text-[14px] text-white shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-transform duration-300 hover:scale-[1.04]"
        >
          <IconDownload size={15} />
          {p.cta.label}
        </a>
      )}
    </article>
  );
}

export function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\[\[|\]\]/);
  return (
    <>
      {parts.map((t, i) =>
        i % 2 ? (
          <mark key={i} className="hl">
            {t}
          </mark>
        ) : (
          t
        ),
      )}
    </>
  );
}

function PostSheet({ slug }: { slug: string }) {
  const p = site.posts.find((x) => x.slug === slug)!;
  return (
    <article className="content-width pb-44 pt-[16vh]">
      <h3 className="text-[24px] leading-tight tracking-[-0.02em]">{p.title}</h3>
      <p className="mt-1 text-muted">{p.date}</p>
      <div className="mt-10 space-y-5 text-[16px] leading-[1.65]">
        {p.body.map((b, i) => (
          <p key={i}>
            <Highlighted text={b} />
          </p>
        ))}
      </div>
      <p className="mt-16 text-[13px] text-muted">— {site.name}</p>
    </article>
  );
}
