"use client";

import type { ReactNode } from "react";
import type { Tool } from "./BoardProvider";
import { IconCheck, IconCopy, IconFall, IconLink, IconMove, IconNote, IconOriginal, IconPen, IconReset } from "../Icons";

function Btn({ tip, active, onClick, children, wide }: { tip: string; active?: boolean; onClick: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={tip}
      aria-pressed={active}
      data-active={active ? "true" : "false"}
      className={`relative grid h-9 place-items-center rounded-full text-[#181818] transition-colors hover:bg-[#f0f0ee] ${wide ? "px-3 text-[13px] tabular-nums" : "w-9"}`}
    >
      {children}
      <span className="board-tip">{tip}</span>
    </button>
  );
}
const Sep = () => <span className="mx-1 h-5 w-px bg-[#e6e6e3]" aria-hidden />;

export function Toolbar(p: {
  tool: Tool;
  setTool: (t: Tool) => void;
  original: boolean;
  toggleOriginal: () => void;
  zoom: number;
  resetZoom: () => void;
  onFall: () => void;
  onLink: () => void;
  onText: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      data-board-ui
      role="toolbar"
      aria-label="Board tools"
      className="board-toolbar fixed bottom-5 left-1/2 z-[75] flex max-w-[calc(100vw-24px)] items-center overflow-x-auto rounded-full bg-white p-1 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_12px_32px_-8px_rgb(0_0_0/0.25)] [scrollbar-width:none] sm:overflow-visible"
      style={{ transform: "translateX(-50%)", animation: "toolbarIn 420ms var(--ease-out)" }}
    >
      <Btn tip="Move · ⇧ scroll to scale · ⌥ drag to duplicate (V)" active={p.tool === "move"} onClick={() => p.setTool("move")}>
        <IconMove size={17} />
      </Btn>
      <Btn tip="Draw (D)" active={p.tool === "draw"} onClick={() => p.setTool("draw")}>
        <IconPen size={17} />
      </Btn>
      <Btn tip="Note (N)" active={p.tool === "note"} onClick={() => p.setTool("note")}>
        <IconNote size={17} />
      </Btn>
      <Sep />
      <Btn tip="Show the original page (O)" active={p.original} onClick={p.toggleOriginal}>
        <IconOriginal size={17} />
      </Btn>
      <Btn tip="Let everything in view fall" onClick={p.onFall}>
        <IconFall size={17} />
      </Btn>
      <Sep />
      <Btn tip="Zoom to 100% · ⌘/Ctrl + scroll to zoom" onClick={p.resetZoom} wide>
        {Math.round(p.zoom * 100)}%
      </Btn>
      <Sep />
      <Btn tip="Copy a link to this board" onClick={p.onLink}>
        <IconLink size={17} />
      </Btn>
      <Btn tip="Copy the board as text" onClick={p.onText}>
        <IconCopy size={17} />
      </Btn>
      <Btn tip="Put everything back" onClick={p.onReset}>
        <IconReset size={17} />
      </Btn>
      <Btn tip="Done (E)" onClick={p.onClose}>
        <IconCheck size={17} />
      </Btn>
    </div>
  );
}
