"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { IconSocial } from "./Icons";
import { LangSwitch } from "./LangSwitch";
import { useSheet } from "./SheetProvider";
import { useSite } from "./SiteProvider";
import { useBoard } from "./board/BoardProvider";

/** The signature face has Latin glyphs only, so it always writes the Latin name. */
const SIGNATURE = "Mardiansyah Gunting";

/**
 * Footer: when it scrolls into view the whole page inverts to dark
 * (`html.is-inverted` swaps the colour tokens), the portrait and links
 * stagger in, and the signature "writes" itself.
 */
export function Footer({ buildYear }: { buildYear: number }) {
  const { name, contact, social, ui } = useSite();
  // the static HTML carries the build year; the browser corrects it after hydration
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { toggle } = useBoard();
  const { open } = useSheet();

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
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${contact.email}`;
    }
  };

  const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

  return (
    <footer id="contact" ref={ref} className="relative grid min-h-[100svh] place-items-center px-5 py-32">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="sign-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </svg>

      <div className="flex flex-col items-center text-center">
        <div data-board="portrait" className="footer-in relative h-[200px] w-[160px] overflow-hidden rounded-lg bg-tile" style={d(0)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/profile.webp")} alt={SIGNATURE} width={160} height={200} loading="lazy" className="h-full w-full object-cover grayscale-[15%]" />
        </div>

        <div data-board="signature" className="mt-10 flex h-[72px] items-center">
          <span className="signature block whitespace-nowrap text-[clamp(34px,10vw,64px)] text-ink" lang="en">
            {SIGNATURE}
          </span>
        </div>
        {name !== SIGNATURE && <p className="sr-only">{name}</p>}

        <p className="footer-in mt-6" style={d(700)} data-board="email">
          <button type="button" onClick={copy} className="hand-link text-[16px]" aria-live="polite">
            {copied ? ui.copied : contact.email}
          </button>
        </p>

        <p className="footer-in mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] text-muted" style={d(800)} data-board="footer-links">
          <a href={contact.cv} target="_blank" rel="noopener noreferrer" aria-label={`${ui.downloadCv} (${ui.opensNewTab})`} className="transition-colors hover:text-ink">
            {ui.downloadCv}
          </a>
          <button type="button" onClick={(e) => open({ type: "contact" }, e.currentTarget)} className="transition-colors hover:text-ink">
            {ui.sendMessage}
          </button>
          <a href={`tel:${contact.phone}`} className="tabular-nums transition-colors hover:text-ink">
            {contact.phone}
          </a>
          <button type="button" onClick={toggle} className="flex items-center gap-1.5 transition-colors hover:text-ink" aria-label={ui.board.tools}>
            {ui.press}
            <kbd className="grid h-[20px] min-w-[20px] place-items-center rounded-[5px] border border-line px-1 font-sans text-[13px] leading-none text-ink">E</kbd>
          </button>
        </p>

        <p className="footer-in mt-5 flex items-center gap-5 text-muted" style={d(900)} data-board="social">
          {social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (${ui.opensNewTab})`} className="transition-colors hover:text-ink">
              <IconSocial name={s.icon} size={18} />
            </a>
          ))}
        </p>

        <LangSwitch className="footer-in mt-6" />

        <p className="footer-in mt-8 text-[14px] text-muted" style={d(1000)}>
          © {year} {SIGNATURE} — {ui.rights}
        </p>
      </div>
    </footer>
  );
}
