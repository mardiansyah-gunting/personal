import { presegment } from "@/lib/richText";
import { en } from "./en";
import { id } from "./id";
import type { Lang, Site } from "./types";
import { zh } from "./zh";

/** Rich text gets its Chinese word breaks here, at build time, not in the browser. */
const prepare = (site: Site): Site => ({ ...site, hero: presegment(site.hero), productsLine: presegment(site.productsLine) });

const sites: Record<Lang, Site> = { en: prepare(en), id: prepare(id), zh: prepare(zh) };

export function getSite(lang: Lang): Site {
  return sites[lang];
}
