import { en } from "./en";
import type { Lang, Site } from "./types";

const sites: Partial<Record<Lang, Site>> = { en };

export function getSite(lang: Lang): Site {
  const site = sites[lang];
  if (!site) throw new Error(`no content for language "${lang}"`);
  return site;
}
