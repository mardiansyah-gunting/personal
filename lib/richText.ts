import type { Seg } from "@/content/types";

export type SegLink = Exclude<Seg, string>;
/** space = a real space; break = an allowed line break with nothing rendered (between Chinese words). */
export type Unit = { kind: "space" } | { kind: "break" } | { kind: "word"; text: string } | { kind: "link"; seg: SegLink };

const HAN = /\p{Script=Han}/u;
const CJK = /[\p{Script=Han}\u3000-\u303F\uFF00-\uFFEF]/u; // Han plus CJK punctuation and full-width forms
const CLOSING = /^[\p{Pe}\p{Pf}\p{Po}\p{Pd}]+$/u; // ，。、：；！？）」 and dashes stay with the word before
const OPENING = /^[\p{Ps}\p{Pi}]+$/u; // （「“ stay with the word after

let segmenter: Intl.Segmenter | undefined;
const words = (text: string) => [...(segmenter ??= new Intl.Segmenter("zh", { granularity: "word" })).segment(text)].map((s) => s.segment);

/**
 * Splits rich text into words, spaces and links so each word can animate on its own.
 * Text without spaces (Chinese) is segmented into words with break opportunities between them.
 */
export function toUnits(segs: Seg[]): Unit[] {
  const out: Unit[] = [];
  for (const s of segs) {
    if (typeof s !== "string") {
      const last = out[out.length - 1];
      if (last?.kind === "word" && CJK.test(last.text)) out.push({ kind: "break" }); // Chinese may wrap right before a link
      out.push({ kind: "link", seg: s });
      continue;
    }
    for (const tok of s.split(/(\s+)/)) {
      if (!tok) continue;
      if (/^\s+$/.test(tok)) out.push({ kind: "space" });
      else if (!HAN.test(tok)) out.push({ kind: "word", text: tok });
      else {
        let glue = false;
        for (const w of words(tok)) {
          if (!CLOSING.test(w) && !glue) out.push({ kind: "break" });
          out.push({ kind: "word", text: w });
          glue = OPENING.test(w);
        }
      }
    }
  }
  return out;
}

/** Consecutive words/links form one unbreakable group, so "TREEO Indonesia." never splits from its full stop. */
export function toGroups(units: Unit[]): Unit[][] {
  const groups: Unit[][] = [];
  let cur: Unit[] = [];
  const flush = () => {
    if (cur.length) groups.push(cur);
    cur = [];
  };
  for (const u of units) {
    if (u.kind === "space") {
      flush();
      groups.push([u]);
    } else if (u.kind === "break") flush();
    else cur.push(u);
  }
  flush();
  return groups;
}
