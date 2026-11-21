/**
 * Visual = what fills a card / gallery tile.
 * - `kind: "image" | "video"` → a real asset (path already passed through asset()).
 * - any other kind → a built-in generative mockup (no images needed).
 */
export type Visual =
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "timer" | "phone" | "browser" | "darkapp" | "orb" | "specimen" | "chart" | "stickers" | "palette" | "frame"; tone?: string; label?: string }
  | { kind: "poster"; tone?: string; ink?: string; label?: string };
