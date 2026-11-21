import type { BoardState } from "./BoardProvider";

/** BoardState ⇄ URL-safe string. Uses deflate when the browser supports CompressionStream. */

const toB64 = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64 = (str: string) => {
  const b = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

/** round stroke points to keep links short */
const slim = (s: BoardState): BoardState => ({
  ...s,
  strokes: s.strokes.map((st) => ({ ...st, pts: st.pts.map((n) => Math.round(n)) })),
});

export async function encodeBoard(state: BoardState): Promise<string> {
  const json = JSON.stringify(slim(state));
  if (typeof CompressionStream !== "undefined") {
    const stream = new Blob([json]).stream().pipeThrough(new CompressionStream("deflate-raw"));
    const buf = new Uint8Array(await new Response(stream).arrayBuffer());
    return "z" + toB64(buf);
  }
  return "j" + toB64(new TextEncoder().encode(json));
}

export async function decodeBoard(code: string): Promise<BoardState | null> {
  try {
    const bytes = fromB64(code.slice(1));
    let json: string;
    if (code[0] === "z") {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      json = await new Response(stream).text();
    } else json = new TextDecoder().decode(bytes);
    const s = JSON.parse(json);
    return { xf: s.xf ?? {}, strokes: s.strokes ?? [], notes: s.notes ?? [], clones: s.clones ?? [] };
  } catch {
    return null;
  }
}
