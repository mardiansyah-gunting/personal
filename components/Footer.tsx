"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { IconSocial } from "./Icons";
import { useBoard } from "./board/BoardProvider";

/**
 * Footer: when it scrolls into view the whole page inverts to dark
 * (`html.is-inverted` swaps the colour tokens), the portrait and links
 * stagger in, and the signature "writes" itself (clip-path reveal +
 * a subtle turbulence filter for an ink edge).
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { toggle } = useBoard();

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        const on = e.intersectionRatio > 0.3;
        document.documentElement.classList.toggle("is-inverted", on);
        if (on) el.classList.add("footer-on");
      },
      { threshold: [0, 0.15, 0.3, 0.45, 0.6] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("is-inverted");
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.footer.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${site.footer.email}`;
    }
  };

  const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <footer id="contact" ref={ref} className="relative grid min-h-[100svh] place-items-center px-5 py-32">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="sign-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </svg>

      <div className="flex flex-col items-center text-center">
        {/* Portrait placeholder — replace with <img src="/portrait.jpg" …/> */}
        <div
          data-board="portrait"
          className="footer-in relative grid h-[200px] w-[160px] place-items-center overflow-hidden rounded-lg"
          style={{ ...d(0), background: "linear-gradient(160deg, #5a5a5a, #262626 60%, #1a1a1a)" }}
        >
          <span className="text-[44px] font-semibold tracking-[-0.04em] text-white/85">{initials}</span>
          <svg className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay" aria-hidden>
            <filter id="pgrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            </filter>
            <rect width="100%" height="100%" filter="url(#pgrain)" />
          </svg>
        </div>

        <div data-board="signature" className="mt-10 h-[72px]">
          <span className="signature block text-[64px] text-ink">{site.name}</span>
        </div>

        <p className="footer-in mt-6" style={d(700)} data-board="email">
          <button type="button" onClick={copy} className="hand-link text-[14px]" aria-live="polite">
            {copied ? "Copied to clipboard" : site.footer.email}
          </button>
        </p>

        <p className="footer-in mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-muted" style={d(800)} data-board="footer-links">
          {site.footer.links.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <button type="button" onClick={toggle} className="flex items-center gap-1.5 transition-colors hover:text-ink" aria-label="Draw on this page (E)">
            press
            <kbd className="grid h-[18px] min-w-[18px] place-items-center rounded-[5px] border border-line px-1 font-sans text-[11px] leading-none text-ink">E</kbd>
          </button>
        </p>

        <p className="footer-in mt-5 flex items-center gap-5 text-muted" style={d(900)} data-board="social">
          {site.footer.social.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} className="transition-colors hover:text-ink">
              <IconSocial name={s.icon} size={16} />
            </a>
          ))}
        </p>
      </div>
    </footer>
  );
}
