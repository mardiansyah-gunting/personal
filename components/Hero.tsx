"use client";

import { LangSwitch } from "./LangSwitch";
import { RichText } from "./RichText";
import { useSite } from "./SiteProvider";

export function Hero() {
  const { name, role, status, hero } = useSite();
  const toNow = () => document.getElementById("now")?.scrollIntoView({ behavior: "smooth", block: "center" });

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
            onClick={toNow}
           
            className="group stagger-in relative flex items-center gap-2 text-[16px] leading-[1.35]"
            style={{ animationDelay: "80ms" }}
            aria-label={`${status.label} — ${status.note}`}
          >
            <span className="status-dot" />
            <span className="whitespace-nowrap">{status.label}</span>
            <span className="pointer-events-none absolute right-0 top-[calc(100%+10px)] z-10 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[14px] text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              {status.note}
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
