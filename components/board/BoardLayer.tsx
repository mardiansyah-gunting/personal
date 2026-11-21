"use client";

import { useEffect, useLayoutEffect, useRef, type PointerEvent as RPointerEvent } from "react";
import { applyXf, useBoard, type Note } from "./BoardProvider";
import { IconClose } from "../Icons";
import { useSite } from "../SiteProvider";

const ID = () => Math.random().toString(36).slice(2, 9);

/** Smooth path through points using quadratic curves between midpoints. */
function pathD(p: number[]) {
  if (p.length < 4) return `M${p[0]} ${p[1]} l0.01 0`;
  let d = `M${p[0]} ${p[1]}`;
  for (let i = 2; i < p.length - 2; i += 2) {
    const mx = (p[i] + p[i + 2]) / 2;
    const my = (p[i + 1] + p[i + 3]) / 2;
    d += ` Q${p[i]} ${p[i + 1]} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  return d + ` L${p[p.length - 2]} ${p[p.length - 1]}`;
}

/**
 * Lives inside #board-root (the page wrapper) so drawings, notes and
 * duplicates are positioned in document coordinates and scroll with the page.
 */
export function BoardLayer() {
  const { active, tool, state, commit, setQuiet, toLocal, newNoteId, setNewNoteId } = useBoard();
  const liveRef = useRef<SVGPathElement>(null);
  const clonesRef = useRef<HTMLDivElement>(null);
  const drawing = useRef<number[] | null>(null);

  /* ── duplicates: real DOM copies of the source element ── */
  useLayoutEffect(() => {
    const host = clonesRef.current;
    if (!host) return;
    const wanted = new Set(state.clones.map((c) => c.id));
    host.querySelectorAll<HTMLElement>("[data-board-clone]").forEach((n) => !wanted.has(n.dataset.boardClone!) && n.remove());
    for (const c of state.clones) {
      let node = host.querySelector<HTMLElement>(`[data-board-clone="${c.id}"]`);
      if (!node) {
        const src = document.querySelector<HTMLElement>(`[data-board="${c.src}"]`);
        if (!src) continue;
        // measure the source without its own transform
        const prev = [src.style.translate, src.style.scale, src.style.rotate];
        src.style.translate = src.style.scale = src.style.rotate = "";
        const r = src.getBoundingClientRect();
        [src.style.translate, src.style.scale, src.style.rotate] = prev;
        const { x, y } = toLocal(r.left, r.top);
        node = src.cloneNode(true) as HTMLElement;
        node.removeAttribute("data-board");
        node.querySelectorAll("[data-board],[id]").forEach((n) => (n.removeAttribute("data-board"), n.removeAttribute("id")));
        node.removeAttribute("id");
        node.dataset.boardClone = c.id;
        node.classList.add("board-clone", "is-visible");
        Object.assign(node.style, { position: "absolute", left: `${x}px`, top: `${y}px`, width: `${src.offsetWidth}px`, margin: "0", pointerEvents: "auto" });
        host.appendChild(node);
      }
      applyXf(node, c);
    }
  }, [state.clones, toLocal]);

  /* ── drawing & placing notes ── */
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (!active || e.button !== 0) return;
    if ((e.target as Element).closest(".sticky-note")) return;
    const { x, y } = toLocal(e.clientX, e.clientY);
    if (tool === "draw") {
      e.currentTarget.setPointerCapture(e.pointerId);
      drawing.current = [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
      liveRef.current?.setAttribute("d", pathD(drawing.current));
    } else if (tool === "note") {
      e.preventDefault(); // keep the browser from stealing focus from the new note
      const id = ID();
      commit((s) => ({ ...s, notes: [...s.notes, { id, x: x - 90, y: y - 18, r: Math.round((Math.random() - 0.5) * 6), text: "" }] }));
      setNewNoteId(id);
    }
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const pts = drawing.current;
    if (!pts) return;
    const { x, y } = toLocal(e.clientX, e.clientY);
    const lx = pts[pts.length - 2];
    const ly = pts[pts.length - 1];
    if (Math.hypot(x - lx, y - ly) < 2) return;
    pts.push(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    liveRef.current?.setAttribute("d", pathD(pts));
  };
  const onUp = () => {
    const pts = drawing.current;
    drawing.current = null;
    liveRef.current?.setAttribute("d", "");
    if (pts && pts.length >= 2) commit((s) => ({ ...s, strokes: [...s.strokes, { id: ID(), pts, w: 3 }] }));
  };

  const catchesPointer = active && (tool === "draw" || tool === "note");

  return (
    <div
      className="board-layer absolute inset-0 z-[35]"
      style={{ pointerEvents: catchesPointer ? "auto" : "none", touchAction: catchesPointer ? "none" : undefined }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      data-board-ui={catchesPointer ? "" : undefined}
    >
      <div ref={clonesRef} className="absolute inset-0" style={{ pointerEvents: "none" }} />
      <svg className="absolute inset-0 h-full w-full overflow-visible" style={{ pointerEvents: "none" }} aria-hidden>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ink)" }}>
          {state.strokes.map((s) => (
            <path key={s.id} d={pathD(s.pts)} strokeWidth={s.w} />
          ))}
          <path ref={liveRef} strokeWidth={3} />
        </g>
      </svg>
      {state.notes.map((n) => (
        <StickyNote key={n.id} note={n} active={active} autoFocus={n.id === newNoteId} onFocused={() => setNewNoteId(null)} commit={commit} setQuiet={setQuiet} />
      ))}
    </div>
  );
}

function StickyNote({
  note,
  active,
  autoFocus,
  onFocused,
  commit,
  setQuiet,
}: {
  note: Note;
  active: boolean;
  autoFocus: boolean;
  onFocused: () => void;
  commit: ReturnType<typeof useBoard>["commit"];
  setQuiet: ReturnType<typeof useBoard>["setQuiet"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const { zoomRef } = useBoard();
  const { ui } = useSite();

  useEffect(() => {
    if (!autoFocus) return;
    const raf = requestAnimationFrame(() => {
      taRef.current?.focus({ preventScroll: true });
      onFocused();
    });
    return () => cancelAnimationFrame(raf);
  }, [autoFocus, onFocused]);

  const update = (patch: Partial<Note>, undoable = false) =>
    (undoable ? commit : setQuiet)((s) => ({ ...s, notes: s.notes.map((x) => (x.id === note.id ? { ...x, ...patch } : x)) }));
  const remove = () => commit((s) => ({ ...s, notes: s.notes.filter((x) => x.id !== note.id) }));

  const startDrag = (e: RPointerEvent) => {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX;
    const sy = e.clientY;
    const el = ref.current!;
    const move = (ev: PointerEvent) => {
      el.style.translate = `${(ev.clientX - sx) / zoomRef.current}px ${(ev.clientY - sy) / zoomRef.current}px`;
    };
    const up = (ev: PointerEvent) => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      el.style.translate = "";
      const dx = (ev.clientX - sx) / zoomRef.current;
      const dy = (ev.clientY - sy) / zoomRef.current;
      if (Math.hypot(dx, dy) > 1) update({ x: note.x + dx, y: note.y + dy }, true);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  };

  return (
    <div
      ref={ref}
      data-board-ui
      className="sticky-note group"
      style={{ left: note.x, top: note.y, rotate: `${note.r}deg`, pointerEvents: active ? "auto" : "none" }}
    >
      <div className="absolute inset-x-0 top-0 h-4 cursor-move" onPointerDown={startDrag} aria-hidden />
      {active && (
        <button
          type="button"
          onClick={remove}
          aria-label={ui.board.noteDelete}
          className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[#181818] text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <IconClose size={12} />
        </button>
      )}
      <textarea
        ref={taRef}
        value={note.text}
        readOnly={!active}
        placeholder={ui.board.notePlaceholder}
        aria-label={ui.board.noteLabel}
        onChange={(e) => update({ text: e.target.value })}
        onBlur={() => !note.text.trim() && setQuiet((s) => ({ ...s, notes: s.notes.filter((x) => x.id !== note.id) }))}
      />
    </div>
  );
}
