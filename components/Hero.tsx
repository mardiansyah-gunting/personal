"use client";

import { site } from "@/content/site";
import { RichText } from "./RichText";

export function Hero() {
  const toNow = () => document.getElementById("now")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section id="about" className="content-width pt-24 sm:pt-32">
      <div className="flex items-start justify-between gap-6">
        <div data-board="identity" className="stagger-in">
          <h1 className="text-[15px] font-medium leading-[1.35] tracking-[-0.01em]">{site.name}</h1>
          <span className="block leading-[1.35] text-muted">{site.role}</span>
        </div>

        <button
          type="button"
          onClick={toNow}
          data-board="status"
          className="group stagger-in relative flex items-center gap-2 text-[14px] leading-[1.35]"
          style={{ animationDelay: "80ms" }}
          aria-label={`${site.status.label} — ${site.status.note}`}
        >
          <span className="status-dot" />
          <span>{site.status.label}</span>
          <span className="pointer-events-none absolute right-0 top-[calc(100%+10px)] whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-y-1">
            {site.status.note}
          </span>
        </button>
      </div>

      <div data-board="statement" className="hero-fog mt-20 sm:mt-24">
        <p className="max-w-[540px] text-[21px] leading-[1.2] tracking-[-0.02em] sm:text-[24px] sm:leading-[1.18]">
          <RichText segs={site.hero} animate />
        </p>
      </div>
    </section>
  );
}
