"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Horizontal card rail ("carousel").
 * – Native scroll + scroll-snap (touch & trackpad feel native).
 * – Mouse drag with momentum on desktop.
 * – The card nearest the centre is "current": full size, others shrink & fade
 *   continuously based on their distance from the centre.
 * – Clicking a side card centres it; clicking the current card calls onOpen.
 */
export function CardRail({
  items,
  cardW,
  gap = 24,
  minScale = 0.8,
  minOpacity = 0.4,
  label,
  onOpen,
}: {
  items: { key: string; node: ReactNode; label: string }[];
  cardW: string; // any CSS length, e.g. "min(540px, 84vw)"
  gap?: number;
  minScale?: number;
  minOpacity?: number;
  label: string;
  onOpen: (index: number, el: HTMLElement) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);

  const cards = () => Array.from(railRef.current?.querySelectorAll<HTMLElement>("[data-rail-card]") ?? []);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    cards().forEach((c, i) => {
      const center = c.offsetLeft + c.offsetWidth / 2;
      const d = (center - mid) / (c.offsetWidth + gap);
      const t = Math.min(1, Math.abs(d));
      c.style.transform = `scale(${1 - (1 - minScale) * t})`;
      c.style.opacity = String(1 - (1 - minOpacity) * t);
      if (Math.abs(d) < bestD) {
        bestD = Math.abs(d);
        best = i;
      }
    });
    if (best !== currentRef.current) {
      currentRef.current = best;
    }
    cards().forEach((c, i) => {
      c.classList.toggle("is-current", i === best);
      c.setAttribute("aria-current", i === best ? "true" : "false");
    });
  }, [gap, minScale, minOpacity]);

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const rail = railRef.current;
    const c = cards()[i];
    if (!rail || !c) return;
    rail.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - rail.clientWidth / 2, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // scroll → transforms
  useEffect(() => {
    const rail = railRef.current!;
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), update()));
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => update());
    ro.observe(rail);
    update();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [update]);

  // mouse drag with momentum
  useEffect(() => {
    const rail = railRef.current!;
    let down = false;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let v = 0;
    let unsnapTimer = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      dragging = false;
      startX = lastX = e.clientX;
      startLeft = rail.scrollLeft;
      lastT = performance.now();
      v = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 5) {
        dragging = true;
        clearTimeout(unsnapTimer);
        rail.classList.add("is-dragging");
        rail.style.scrollSnapType = "none";
      }
      if (!dragging) return;
      const now = performance.now();
      v = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      rail.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!dragging) return;
      rail.classList.remove("is-dragging");
      // momentum: project where we'd land, then centre the nearest card
      const projected = rail.scrollLeft - v * 260;
      const mid = projected + rail.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      cards().forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      scrollToIndex(best);
      unsnapTimer = window.setTimeout(() => (rail.style.scrollSnapType = ""), 650);
    };

    rail.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      clearTimeout(unsnapTimer);
    };
  }, [scrollToIndex]);

  const onKey = (e: React.KeyboardEvent) => {
    const move = (to: number) => {
      e.preventDefault();
      scrollToIndex(to);
      cards()[to]?.focus({ preventScroll: true }); // focus follows the centred card
    };
    if (e.key === "ArrowRight") move(Math.min(items.length - 1, currentRef.current + 1));
    else if (e.key === "ArrowLeft") move(Math.max(0, currentRef.current - 1));
  };

  return (
    <div
      ref={railRef}
      className="rail relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKey}
      style={{ ["--card-w" as string]: cardW, ["--rail-gap" as string]: `${gap}px` } as CSSProperties}
    >
      {items.map((it, i) => (
        <button
          key={it.key}
          type="button"
          data-rail-card
          className="rail-card"
          aria-label={it.label}
          onClick={(e) => {
            // e.detail === 0: Enter/Space on a focused card — open it even if it isn't centred yet
            if (i === currentRef.current || e.detail === 0) onOpen(i, e.currentTarget);
            else scrollToIndex(i);
          }}
          onFocus={(e) => i !== currentRef.current && e.currentTarget.matches(":focus-visible") && scrollToIndex(i)}
        >
          {it.node}
        </button>
      ))}
    </div>
  );
}
