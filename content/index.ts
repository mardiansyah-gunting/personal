import { en } from "./en";
import { id } from "./id";
import { zh } from "./zh";
import type { Lang, Site } from "./types";

const sites: Record<Lang, Site> = { en, id, zh };

export function getSite(lang: Lang): Site {
  return sites[lang];
}
