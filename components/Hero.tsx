"use client";

import { useEffect, useRef, useState } from "react";
import { LangSwitch } from "./LangSwitch";
import { RichText } from "./RichText";
import { useSite } from "./SiteProvider";

export function Hero() {
  const { name, role, status, hero, contact, ui } = useSite();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section id="about" className="content-width pt-24 sm:pt-32">
      <div className="flex items-start justify-between gap-6">
        <div className="stagger-in">
          <h1 className="text-[18px] leading-[1.35]">{name}</h1>
          <span className="block leading-[1.35] text-muted">{role}</span>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={copyEmail}
            className="group stagger-in relative flex items-center gap-2 text-[16px] leading-[1.35]"
            style={{ animationDelay: "80ms" }}
            aria-label={`${status.label} — ${copied ? ui.copied : status.note}`}
            aria-live="polite"
          >
            <span className="status-dot" />
            <span className="whitespace-nowrap">{status.label}</span>
            <span
              className={`pointer-events-none absolute right-0 top-[calc(100%+10px)] z-10 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[14px] text-bg transition-all duration-300 ${
                copied
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              {copied ? ui.copied : status.note}
            </span>
          </button>
          <LangSwitch className="stagger-in" />
        </div>
      </div>

      <div className="hero-fog mt-20 sm:mt-24">
        <p className="max-w-[540px] text-[26px] leading-[1.25] sm:text-[30px]">
          <RichText segs={hero} animate />
        </p>
      </div>
    </section>
  );
}
