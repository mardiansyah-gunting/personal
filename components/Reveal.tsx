"use client";

import { useEffect, useRef, type HTMLAttributes, type CSSProperties } from "react";

/** Fades + lifts its children in the first time they scroll into view. */
export function Reveal({
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { delay?: number; "data-board"?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` } as CSSProperties} {...rest}>
      {children}
    </div>
  );
}
