"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { Toolbar } from "./Toolbar";
import { decodeBoard, encodeBoard } from "./codec";

/* ──────────────────────────────────────────────────────────────
   "Draw on this page" — press E anywhere.
   Any element with data-board="unique-id" becomes movable.
   State is plain JSON → persisted to localStorage and shareable
   as a compressed #board=… link.
────────────────────────────────────────────────────────────── */

export type Tool = "move" | "draw" | "note";
export type Xf = { x: number; y: number; s: number; r: number };
export type Stroke = { id: string; pts: number[]; w: number };
export type Note = { id: string; x: number; y: number; r: number; text: string };
export type Clone = { id: string; src: string } & Xf;
export type BoardState = { xf: Record<string, Xf>; strokes: Stroke[]; notes: Note[]; clones: Clone[] };

export const EMPTY: BoardState = { xf: {}, strokes: [], notes: [], clones: [] };
const STORAGE_KEY = "folio-board-v1";
const ID = () => Math.random().toString(36).slice(2, 9);
const XF0: Xf = { x: 0, y: 0, s: 1, r: 0 };

type Ctx = {
  active: boolean;
  toggle: () => void;
  tool: Tool;
  setTool: (t: Tool) => void;
  state: BoardState;
  commit: (fn: (s: BoardState) => BoardState) => void;
  setQuiet: (fn: (s: BoardState) => BoardState) => void;
  toLocal: (cx: number, cy: number) => { x: number; y: number };
  zoomRef: React.RefObject<number>;
  newNoteId: string | null;
  setNewNoteId: (id: string | null) => void;
};
const BoardCtx = createContext<Ctx | null>(null);
export const useBoard = () => {
  const c = useContext(BoardCtx);
  if (!c) throw new Error("useBoard must be used inside <BoardProvider>");
  return c;
};

export const root = () => document.getElementById("board-root");
const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function applyXf(el: HTMLElement, t?: Xf) {
  el.style.translate = t && (t.x || t.y) ? `${t.x}px ${t.y}px` : "";
  el.style.scale = t && t.s !== 1 ? String(t.s) : "";
  el.style.rotate = t && t.r ? `${t.r}deg` : "";
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [tool, setTool] = useState<Tool>("move");
  const [state, setState] = useState<BoardState>(EMPTY);
  const [zoom, setZoom] = useState(1);
  const [original, setOriginal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; on: boolean }>({ msg: "", on: false });
  const [newNoteId, setNewNoteId] = useState<string | null>(null);
  const history = useRef<BoardState[]>([]);
  const stateRef = useRef(state);
  const zoomRef = useRef(1);
  const toastTimer = useRef(0);
  const loaded = useRef(false);
  stateRef.current = state;
  zoomRef.current = zoom;

  const say = useCallback((msg: string) => {
    setToast({ msg, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), 2200);
  }, []);

  /** state change with an undo step */
  const commit = useCallback((fn: (s: BoardState) => BoardState) => {
    history.current.push(stateRef.current);
    if (history.current.length > 60) history.current.shift();
    setState((s) => fn(s));
  }, []);
  /** state change without an undo step (typing, etc.) */
  const setQuiet = useCallback((fn: (s: BoardState) => BoardState) => setState((s) => fn(s)), []);

  const toLocal = useCallback((cx: number, cy: number) => {
    const r = root()!.getBoundingClientRect();
    return { x: (cx - r.left) / zoomRef.current, y: (cy - r.top) / zoomRef.current };
  }, []);

  const toggle = useCallback(() => {
    if (document.documentElement.classList.contains("has-sheet")) return;
    setActive((a) => {
      if (!a) {
        try {
          if (!sessionStorage.getItem("board-hint")) {
            sessionStorage.setItem("board-hint", "1");
            setTimeout(() => say("Draw, move things around, leave a note. E to exit."), 250);
          }
        } catch {}
      }
      return !a;
    });
  }, [say]);

  /* ── load: shared link first, then localStorage ── */
  useEffect(() => {
    (async () => {
      const m = location.hash.match(/^#board=(.+)$/);
      if (m) {
        const s = await decodeBoard(m[1]);
        if (s) {
          setState(s);
          say("Viewing a shared board — press E to edit");
          loaded.current = true;
          return;
        }
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
      } catch {}
      loaded.current = true;
    })();
  }, [say]);

  /* ── persist ── */
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  /* ── apply element transforms ── */
  useLayoutEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-board]").forEach((el) => applyXf(el, state.xf[el.dataset.board!]));
  }, [state.xf]);

  /* ── html classes ── */
  useEffect(() => {
    const h = document.documentElement.classList;
    h.toggle("board-on", active);
    ["move", "draw", "note"].forEach((t) => h.toggle(`tool-${t}`, active && tool === t));
    h.toggle("board-original", active && original);
    if (!active) setOriginal(false);
  }, [active, tool, original]);

  /* ── zoom ── */
  useEffect(() => {
    const el = root();
    if (!el) return;
    if (zoom === 1) {
      el.style.transform = "";
    } else {
      if (!el.style.transform) el.style.transformOrigin = `50% ${scrollY + innerHeight / 2}px`;
      el.style.transform = `scale(${zoom})`;
    }
  }, [zoom]);
  useEffect(() => {
    if (!active) setZoom(1);
  }, [active]);

  /* ── keyboard ── */
  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (prev) setState(prev);
    else say("Nothing to undo");
  }, [say]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "z" && active) {
        e.preventDefault();
        undo();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (k === "e") toggle();
      else if (!active) return;
      else if (k === "escape") setActive(false);
      else if (k === "v") setTool("move");
      else if (k === "d" || k === "p") setTool("draw");
      else if (k === "n") setTool("note");
      else if (k === "o") setOriginal((o) => !o);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [active, toggle, undo]);

  /* ── while active: block clicks on page content, ctrl+wheel zoom, ⇧+wheel scale ── */
  useEffect(() => {
    if (!active) return;
    const inUI = (t: EventTarget | null) => t instanceof Element && !!t.closest("[data-board-ui]");
    const block = (e: Event) => {
      const r = root();
      if (r && e.target instanceof Node && r.contains(e.target) && !inUI(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((z) => Math.min(2, Math.max(0.3, z * Math.exp(-e.deltaY * 0.0025))));
        return;
      }
      if (e.shiftKey && tool === "move") {
        const el = (e.target as Element)?.closest?.<HTMLElement>("[data-board],[data-board-clone]");
        if (!el) return;
        e.preventDefault();
        const delta = e.deltaY || e.deltaX;
        const f = Math.exp(-delta * 0.0015);
        if (el.dataset.boardClone) {
          const id = el.dataset.boardClone;
          setState((s) => ({ ...s, clones: s.clones.map((c) => (c.id === id ? { ...c, s: Math.min(4, Math.max(0.2, c.s * f)) } : c)) }));
        } else {
          const id = el.dataset.board!;
          setState((s) => {
            const t = s.xf[id] ?? XF0;
            return { ...s, xf: { ...s.xf, [id]: { ...t, s: Math.min(4, Math.max(0.2, t.s * f)) } } };
          });
        }
      }
    };
    document.addEventListener("click", block, true);
    document.addEventListener("dragstart", block, true);
    addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.removeEventListener("click", block, true);
      document.removeEventListener("dragstart", block, true);
      removeEventListener("wheel", onWheel);
    };
  }, [active, tool]);

  /* ── move tool: drag any [data-board] element, ⌥-drag duplicates ── */
  useEffect(() => {
    if (!active || tool !== "move") return;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as Element;
      if (target.closest("[data-board-ui]")) return;
      const el = target.closest<HTMLElement>("[data-board-clone],[data-board]");
      if (!el || !root()?.contains(el)) return;
      e.preventDefault();
      e.stopPropagation();

      const s = stateRef.current;
      let kind: "el" | "clone";
      let id: string;
      let base: Xf;
      if (el.dataset.boardClone) {
        kind = "clone";
        id = el.dataset.boardClone;
        const c = s.clones.find((c) => c.id === id)!;
        base = { x: c.x, y: c.y, s: c.s, r: c.r };
      } else if (e.altKey) {
        kind = "clone";
        id = ID();
        base = { ...(s.xf[el.dataset.board!] ?? XF0) };
        commit((st) => ({ ...st, clones: [...st.clones, { id, src: el.dataset.board!, ...base }] }));
      } else {
        kind = "el";
        id = el.dataset.board!;
        base = { ...(s.xf[id] ?? XF0) };
      }
      const sx = e.clientX;
      const sy = e.clientY;
      let moved = false;
      let node: HTMLElement | null = kind === "el" || el.dataset.boardClone ? el : null;
      node?.classList.add("is-grabbing");

      const onMove = (ev: PointerEvent) => {
        const dx = (ev.clientX - sx) / zoomRef.current;
        const dy = (ev.clientY - sy) / zoomRef.current;
        if (!moved && Math.hypot(dx, dy) < 2) return;
        moved = true;
        node ??= document.querySelector<HTMLElement>(`[data-board-clone="${id}"]`);
        if (node) node.style.translate = `${base.x + dx}px ${base.y + dy}px`;
      };
      const onUp = (ev: PointerEvent) => {
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerup", onUp);
        node?.classList.remove("is-grabbing");
        if (!moved) return;
        const x = base.x + (ev.clientX - sx) / zoomRef.current;
        const y = base.y + (ev.clientY - sy) / zoomRef.current;
        if (kind === "el") {
          commit((st) => ({ ...st, xf: { ...st.xf, [id]: { ...base, x, y } } }));
        } else {
          // the clone creation above already made an undo step; don't add another
          (el.dataset.boardClone ? commit : setQuiet)((st) => ({ ...st, clones: st.clones.map((c) => (c.id === id ? { ...c, x, y } : c)) }));
        }
      };
      addEventListener("pointermove", onMove);
      addEventListener("pointerup", onUp);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [active, tool, commit, setQuiet]);

  /* ── actions ── */
  const fall = useCallback(() => {
    const all = Array.from(document.querySelectorAll<HTMLElement>("[data-board],[data-board-clone]")).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0;
    });
    const set = all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
    if (!set.length) return say("Nothing in view to drop");
    commit((s) => s);
    const s = stateRef.current;
    const z = zoomRef.current;
    const bodies = set.map((el) => {
      const cloneId = el.dataset.boardClone;
      const base = cloneId ? (({ x, y, s, r }) => ({ x, y, s, r }))(s.clones.find((c) => c.id === cloneId)!) : { ...(s.xf[el.dataset.board!] ?? XF0) };
      const rect = el.getBoundingClientRect();
      return {
        el,
        cloneId,
        id: el.dataset.board,
        base,
        rect,
        x: 0,
        y: 0,
        rot: 0,
        vx: (Math.random() - 0.5) * 160,
        vy: -Math.random() * 260,
        // wide things tumble less
        vr: (Math.random() - 0.5) * 120 * Math.min(1, 220 / Math.max(1, rect.width)),
        rest: false,
      };
    });
    document.documentElement.classList.add("board-falling");
    const G = 2600;
    let last = performance.now();
    const t0 = last;
    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      let alive = false;
      for (const b of bodies) {
        if (b.rest) continue;
        alive = true;
        b.vy += G * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += b.vr * dt;
        // elements that already reach below the viewport stay put (never "fall" upward)
        const floor = Math.max(0, innerHeight - 4 - b.rect.bottom);
        if (b.y >= floor) {
          b.y = floor;
          b.vy = -b.vy * 0.32;
          b.vx *= 0.7;
          b.vr *= 0.55;
          if (Math.abs(b.vy) < 90) {
            b.vy = 0;
            b.vx *= 0.8;
            if (Math.abs(b.vx) < 8) b.rest = true;
          }
        }
        if (b.rect.left + b.x < 0) {
          b.x = -b.rect.left;
          b.vx = Math.abs(b.vx) * 0.5;
        }
        if (b.rect.right + b.x > innerWidth) {
          b.x = innerWidth - b.rect.right;
          b.vx = -Math.abs(b.vx) * 0.5;
        }
        b.el.style.translate = `${b.base.x + b.x / z}px ${b.base.y + b.y / z}px`;
        b.el.style.rotate = `${b.base.r + b.rot}deg`;
      }
      if (alive && now - t0 < 5000) requestAnimationFrame(step);
      else {
        document.documentElement.classList.remove("board-falling");
        setState((st) => {
          const xf = { ...st.xf };
          let clones = st.clones;
          for (const b of bodies) {
            const t = { ...b.base, x: b.base.x + b.x / z, y: b.base.y + b.y / z, r: b.base.r + b.rot };
            if (b.cloneId) clones = clones.map((c) => (c.id === b.cloneId ? { ...c, ...t } : c));
            else xf[b.id!] = t;
          }
          return { ...st, xf, clones };
        });
      }
    };
    requestAnimationFrame(step);
  }, [commit, say]);

  const copyLink = useCallback(async () => {
    const code = await encodeBoard(stateRef.current);
    const url = `${location.origin}${location.pathname}#board=${code}`;
    try {
      await navigator.clipboard.writeText(url);
      say("Link to this board copied");
    } catch {
      say("Couldn't access the clipboard");
    }
  }, [say]);

  const copyText = useCallback(async () => {
    const s = stateRef.current;
    const notes = s.notes.map((n) => n.text.trim()).filter(Boolean);
    const text = [
      `Board — ${site.name}`,
      `${location.origin}${location.pathname}`,
      "",
      "Notes",
      ...(notes.length ? notes.map((n) => `- ${n.replace(/\n+/g, " ")}`) : ["(none)"]),
      "",
      `${s.strokes.length} drawings · ${Object.keys(s.xf).length} moved elements · ${s.clones.length} duplicates`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      say("Board copied as text");
    } catch {
      say("Couldn't access the clipboard");
    }
  }, [say]);

  const reset = useCallback(() => {
    commit(() => EMPTY);
    setZoom(1);
    if (location.hash.startsWith("#board=")) window.history.replaceState(null, "", location.pathname + location.search);
    say("Everything is back in place");
  }, [commit, say]);

  return (
    <BoardCtx.Provider value={{ active, toggle, tool, setTool, state, commit, setQuiet, toLocal, zoomRef, newNoteId, setNewNoteId }}>
      {children}
      {active && (
        <Toolbar
          tool={tool}
          setTool={setTool}
          original={original}
          toggleOriginal={() => setOriginal((o) => !o)}
          zoom={zoom}
          resetZoom={() => setZoom(1)}
          onFall={fall}
          onLink={copyLink}
          onText={copyText}
          onReset={reset}
          onClose={() => setActive(false)}
        />
      )}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-[76px] left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[#181818] px-3.5 py-2 text-[13px] text-white shadow-lg transition-all duration-300"
        style={{ opacity: toast.on ? 1 : 0, translate: toast.on ? "0 0" : "0 6px", visibility: toast.msg ? "visible" : "hidden" }}
      >
        {toast.msg}
      </div>
    </BoardCtx.Provider>
  );
}
