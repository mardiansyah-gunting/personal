"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Artifact } from "@/content/types";
import { useSite } from "./SiteProvider";
import { useModal } from "./useModal";
import { Visual } from "./visuals/Visual";
import { IconArrow, IconClose } from "./Icons";

/**
 * "Dive" gallery — a pseudo-3D field of work you fly through by scrolling.
 *
 * The section is tall (N × 16vh + 120vh); a sticky 100vh stage stays pinned
 * while scroll progress moves a virtual camera along the Z axis.
 * Each item has a depth z = index; distance d = z − camera.
 *   scale    = 1 / (1 + 0.6·d)               (perspective)
 *   position = (x, y) · scale                (things spread out as they approach)
 *   opacity  → 0 behind the camera and beyond FAR
 *   blur     → depth of field for far items and items passing the lens
 * The camera eases toward its target every frame (lerp) for an inertial feel.
 */
const FAR = 6.5;

export function DiveGallery() {
  const { artifacts: items, ui } = useSite();
  const N = items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-dive]"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // deterministic layout: golden-angle spiral, never dead-centre
    const layout = items.map((it, i) => {
      const a = i * 2.39996 + 0.6;
      const r = 0.3 + ((i * 7) % 5) * 0.04;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.85, ratio: it.ratio };
    });

    let W = 0;
    let H = 0;
    let base = 0;
    const measure = () => {
      W = stage.clientWidth;
      H = stage.clientHeight;
      base = Math.min(W, H * 1.35) * (W < 640 ? 0.5 : 0.4);
      els.forEach((el, i) => {
        const { ratio } = layout[i];
        const w = base * Math.sqrt(ratio);
        const h = base / Math.sqrt(ratio);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.marginLeft = `${-w / 2}px`;
        el.style.marginTop = `${-h / 2}px`;
      });
    };

    const target = () => {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      if (hintRef.current) hintRef.current.style.opacity = p > 0.92 ? "0" : "1";
      return -1.5 + p * (N - 1 - 0.1 + 1.5);
    };

    let cam = target();
    let raf = 0;
    let running = false;

    const draw = () => {
      els.forEach((el, i) => {
        const d = i - cam;
        let o = 1;
        if (d < 0) o = Math.max(0, 1 + d / 0.5);
        if (d > FAR - 2.5) o = Math.max(0, Math.min(o, (FAR - d) / 2.5));
        if (o <= 0.001) {
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          return;
        }
        el.style.visibility = "visible";
        const s = 1 / (1 + 0.6 * Math.max(-0.45, d));
        const { x, y } = layout[i];
        const tx = x * W * 1.35 * s;
        const ty = y * H * 1.35 * s;
        let blur = 0;
        if (d > 3) blur = Math.min(5, (d - 3) * 1.3);
        if (d < 0.35) blur = Math.min(14, (0.35 - d) * 16);
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
        el.style.opacity = o.toFixed(3);
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.zIndex = String(Math.round(1000 - d * 50));
        el.tabIndex = d > -0.2 && d < 4 ? 0 : -1;
      });
    };

    const tick = () => {
      const t = target();
      cam = reduce ? t : cam + (t - cam) * 0.12;
      draw();
      if (Math.abs(t - cam) > 0.0005) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    measure();
    draw();
    const ro = new ResizeObserver(() => {
      measure();
      draw();
    });
    ro.observe(stage);
    addEventListener("scroll", kick, { passive: true });
    return () => {
      ro.disconnect();
      removeEventListener("scroll", kick);
      cancelAnimationFrame(raf);
    };
  }, [items, N]);

  return (
    <section id="gallery" ref={sectionRef} className="section-gap relative" style={{ height: `${N * 16 + 120}vh` }} aria-label={ui.sections.gallery}>
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden" style={{ isolation: "isolate" }}>
        <div className="content-width pointer-events-none absolute inset-x-0 top-24 z-0">
          <h2 className="text-[18px] text-muted">{ui.sections.gallery}</h2>
        </div>
        {items.map((it, i) => (
          <button key={i} type="button" data-dive className="dive-item" aria-label={`${it.title} — ${it.kind}`} onClick={() => setLightbox(i)}>
            <Visual visual={it.visual} />
          </button>
        ))}
        <p ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-8 z-[1100] text-center text-[15px] text-muted transition-opacity duration-500">
          {ui.galleryHint}
        </p>
      </div>
      {lightbox !== null && <Lightbox items={items} labels={ui} index={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}

function Lightbox({ items, labels, index, onChange, onClose }: { items: Artifact[]; labels: { previous: string; next: string; close: string }; index: number; onChange: (i: number) => void; onClose: () => void }) {
  const it = items[index];
  const boxRef = useRef<HTMLDivElement>(null);
  useModal(boxRef, true);
  useEffect(() => boxRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true }), []);
  const go = useCallback((dir: number) => onChange((index + dir + items.length) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", onKey);
    document.documentElement.classList.add("has-sheet");
    return () => {
      removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("has-sheet");
    };
  }, [go, onClose]);

  return createPortal(
    <div
      ref={boxRef}
      role="dialog"
      aria-modal="true"
      aria-label={it.title}
      className="fixed inset-0 z-[65] grid place-items-center"
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", animation: "lightboxFade 300ms ease-out" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <figure key={index} className="flex flex-col items-center" style={{ animation: "lightboxIn 450ms var(--ease-out)" }}>
        <div className="relative overflow-hidden rounded-xl bg-tile shadow-[var(--shadow-float)]" style={{ width: `min(86vw, ${72 * it.ratio}vh)`, aspectRatio: String(it.ratio) }}>
          <Visual visual={it.visual} />
        </div>
        <figcaption className="mt-4 text-center text-[15px]">
          {it.title} <span className="text-muted">— {it.kind}</span>
          <span className="ml-3 tabular-nums text-muted">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
      <button onClick={() => go(-1)} aria-label={labels.previous} className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-paper text-[#181818] shadow-[var(--shadow-card)] sm:left-8">
        <IconArrow dir="left" size={16} />
      </button>
      <button onClick={() => go(1)} aria-label={labels.next} className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-paper text-[#181818] shadow-[var(--shadow-card)] sm:right-8">
        <IconArrow size={16} />
      </button>
      <button onClick={onClose} aria-label={labels.close} className="sheet-close">
        <IconClose size={16} />
      </button>
    </div>,
    document.body,
  );
}
