"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Site } from "@/content/types";
import { hashFor, parseHash, type SheetTarget } from "@/lib/sheet";
import { IconClose, IconExternal } from "./Icons";
import { useSite } from "./SiteProvider";
import { useModal } from "./useModal";
import { Visual } from "./visuals/Visual";

export type { SheetTarget };

type Ctx = { open: (t: SheetTarget, origin?: HTMLElement | null) => void; close: () => void; current: SheetTarget | null };
const SheetCtx = createContext<Ctx>({ open: () => {}, close: () => {}, current: null });
export const useSheet = () => useContext(SheetCtx);

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function titleFor(t: SheetTarget, site: Site): string {
  if (t.type === "contact") return site.ui.form.title;
  if (t.type === "project") return site.projects.find((p) => p.slug === t.slug)?.title ?? "";
  return site.experience.find((e) => e.slug === t.slug)?.role ?? "";
}

/**
 * Detail "sheets" for projects, experience and the contact form.
 * – Opens from the clicked card (clip-path morph) or slides up from the bottom.
 * – Deep-linkable: #/work/<slug>, #/experience/<slug>, #/contact; the browser back button closes it.
 * – Focus returns to whatever opened it.
 */
export function SheetProvider({ children }: { children: ReactNode }) {
  const site = useSite();
  const [current, setCurrent] = useState<SheetTarget | null>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const animateClose = useCallback(() => {
    const el = sheetRef.current;
    if (!el || closingRef.current) return;
    closingRef.current = true;
    const r = originRef.current?.getBoundingClientRect();
    const visible = r && r.bottom > 0 && r.top < innerHeight && r.width > 0;
    const anim = visible
      ? el.animate(
          [
            { clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 },
            { clipPath: `inset(${r!.top}px ${innerWidth - r!.right}px ${innerHeight - r!.bottom}px ${r!.left}px round 8px)`, opacity: 0.4 },
          ],
          { duration: 420, easing: EASE, fill: "forwards" },
        )
      : el.animate([{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], { duration: 420, easing: EASE, fill: "forwards" });
    anim.onfinish = () => {
      closingRef.current = false;
      setCurrent(null);
      document.documentElement.classList.remove("has-sheet");
      document.getElementById("board-root")?.removeAttribute("inert"); // before React's cleanup, so focus can land
      returnFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, []);

  const open = useCallback((t: SheetTarget, origin?: HTMLElement | null) => {
    originRef.current = origin ?? null;
    returnFocusRef.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : (origin ?? null);
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
    const fromHash = parseHash(location.hash, site);
    if (fromHash) {
      setCurrent(fromHash);
      document.documentElement.classList.add("has-sheet");
    }
    const onPop = () => {
      const t = parseHash(location.hash, site);
      if (t) {
        originRef.current = null;
        setCurrent(t);
        document.documentElement.classList.add("has-sheet");
      } else animateClose();
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [animateClose, site]);

  // open animation
  useEffect(() => {
    const el = sheetRef.current;
    if (!current || !el) return;
    el.scrollTop = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = originRef.current?.getBoundingClientRect();
    if (!reduce && r && r.width > 0) {
      el.animate(
        [
          { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 8px)` },
          { clipPath: "inset(0px 0px 0px 0px round 0px)" },
        ],
        { duration: 650, easing: EASE },
      );
    } else if (!reduce) {
      el.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 600, easing: EASE });
    }
    el.querySelector<HTMLElement>("[data-sheet-body]")?.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: reduce ? 1 : 800, delay: reduce ? 0 : 120, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" },
    );
    el.focus({ preventScroll: true });
  }, [current]);

  useModal(sheetRef, current !== null);

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
          <div ref={sheetRef} className="sheet" role="dialog" aria-modal="true" tabIndex={-1} aria-label={titleFor(current, site)} lang={site.lang}>
            <div data-sheet-body>
              {current.type === "project" && <ProjectSheet slug={current.slug} />}
              {current.type === "experience" && <ExperienceSheet slug={current.slug} />}
              {current.type === "contact" && <ContactSheet />}
            </div>
            <button className="sheet-close" onClick={close} aria-label={site.ui.close}>
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
  const { projects, ui } = useSite();
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <article className="pb-44">
      <div className="relative mx-auto mt-[6vh] aspect-[16/10] w-[min(1100px,92vw)] overflow-hidden rounded-xl bg-tile">
        <Visual visual={p.cover} />
      </div>
      <div className="content-width mt-16">
        <h3 className="text-[30px] leading-tight">{p.title}</h3>
        <p className="text-muted">{p.kind}</p>
        <p className="mt-8">{p.summary}</p>
        {p.body.map((b, i) => (
          <p key={i} className="mt-4 text-muted">
            {b}
          </p>
        ))}
        <p className="mt-6 text-[16px] text-muted">{p.tags.join(" · ")}</p>
      </div>
      {p.gallery.map((g, i) => (
        <figure key={i} className="mx-auto mt-24 w-[min(900px,92vw)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-tile">
            <Visual visual={g.visual} />
          </div>
          <figcaption className="mt-3 text-center text-[15px] text-muted">{g.caption}</figcaption>
        </figure>
      ))}
      {p.cta && (
        <a
          href={p.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${p.cta.label} (${ui.opensNewTab})`}
          className="fixed bottom-[72px] left-1/2 z-[61] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#181818] px-4 py-2.5 text-[16px] text-white shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-transform duration-300 hover:scale-[1.04]"
        >
          {p.cta.label}
          <IconExternal size={15} />
        </a>
      )}
    </article>
  );
}

function ExperienceSheet({ slug }: { slug: string }) {
  const { experience, organizations, ui } = useSite();
  const e = experience.find((x) => x.slug === slug);
  if (!e) return null;
  const org = organizations.find((o) => o.slug === e.org);
  return (
    <article className="pb-44 pt-[14vh]">
      <div className="content-width">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={e.logo} alt="" width={40} height={40} className="mb-6 h-10 w-10 rounded-md object-contain" />
        <h3 className="text-[30px] leading-tight">{e.role}</h3>
        <p className="mt-1 text-muted">
          {org ? (
            <a href={org.href} target="_blank" rel="noopener noreferrer" className="hand-link" aria-label={`${e.company} (${ui.opensNewTab})`}>
              {e.company}
            </a>
          ) : (
            e.company
          )}{" "}
          · {e.period}
        </p>
        <div className="mt-10 space-y-4 leading-[1.65]">
          {e.body.map((b, i) => (
            <p key={i}>
              <Highlighted text={b} />
            </p>
          ))}
        </div>
      </div>
      {e.photos.length > 0 && (
        <div className="mx-auto mt-16 grid w-[min(1000px,92vw)] gap-4 sm:grid-cols-2">
          {e.photos.map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-xl bg-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" className="h-full w-full object-cover" />
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}

type SendState = "idle" | "incomplete" | "sending" | "sent" | "error";

/** The old site's form, same formsubmit endpoint and messages, plus contact info. */
function ContactSheet() {
  const { contact, ui } = useSite();
  const [state, setState] = useState<SendState>("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    if (!body.name || !body.email || !body.message) return setState("incomplete");
    setState("sending");
    try {
      const res = await fetch(contact.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json?.success !== "true") throw new Error("send failed");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  };

  const field = "mt-1 block w-full border-0 border-b border-line bg-transparent py-2 text-[18px] text-ink outline-none transition-colors focus:border-ink";

  return (
    <article className="content-width pb-44 pt-[14vh]">
      <h3 className="text-[30px] leading-tight">{ui.form.title}</h3>
      <form onSubmit={submit} noValidate className="mt-10 space-y-6">
        <label className="block text-[15px] text-muted">
          {ui.form.name}
          <input name="name" type="text" autoComplete="name" className={field} />
        </label>
        <label className="block text-[15px] text-muted">
          {ui.form.email}
          <input name="email" type="email" autoComplete="email" className={field} />
        </label>
        <label className="block text-[15px] text-muted">
          {ui.form.message}
          <textarea name="message" rows={5} className={`${field} resize-y`} />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state === "sending"}
            className="rounded-full bg-[#181818] px-5 py-2.5 text-[16px] text-white transition-transform duration-300 hover:scale-[1.04] disabled:opacity-60"
          >
            {ui.form.send}
          </button>
          <p role="status" aria-live="polite" className={`text-[16px] ${state === "sent" ? "text-ink" : "text-muted"}`}>
            {state === "idle" ? "" : ui.form[state]}
          </p>
        </div>
      </form>

      <div className="mt-16 space-y-1 text-[16px]">
        <p>
          <span className="text-muted">{ui.emailLabel}: </span>
          <a href={`mailto:${contact.email}`} className="hand-link">
            {contact.email}
          </a>
        </p>
        <p>
          <span className="text-muted">{ui.phoneLabel}: </span>
          <a href={`tel:${contact.phone}`} className="hand-link tabular-nums">
            {contact.phone}
          </a>
        </p>
      </div>

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
