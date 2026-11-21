"use client";

import { Fragment } from "react";
import { hrefFor, LANG_LABEL, LANGS } from "@/lib/lang";
import { useSite } from "./SiteProvider";

/** EN · ID · 中文 — remembers the choice so the English URL redirects next time. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, ui } = useSite();
  return (
    <nav aria-label={ui.language} className={`flex items-center gap-1.5 text-[15px] text-muted ${className}`}>
      {LANGS.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span aria-hidden>·</span>}
          <a
            href={hrefFor(l)}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => {
              try {
                localStorage.setItem("lang", l);
              } catch {}
            }}
            className={`transition-colors hover:text-ink ${l === lang ? "text-ink" : ""}`}
          >
            {LANG_LABEL[l]}
          </a>
        </Fragment>
      ))}
    </nav>
  );
}
