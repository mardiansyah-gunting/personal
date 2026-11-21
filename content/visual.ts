/**
 * Visual = what fills a card / gallery tile.
 * - `kind: "image"` → a real asset (path already passed through asset()).
 * - any other kind → a built-in generative mockup (components/visuals/Visual.tsx).
 */
export type Visual =
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | { kind: "phone" | "browser" | "darkapp" | "pipeline" | "transcript"; tone?: string; label?: string };
