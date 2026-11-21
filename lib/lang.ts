import type { Lang } from "@/content/types";
import { asset } from "./asset";

export const LANGS = ["en", "id", "zh"] as const satisfies readonly Lang[];
export const SITE_URL = "https://mardiansyah-gunting.github.io/personal";
export const LANG_LABEL: Record<Lang, string> = { en: "EN", id: "ID", zh: "中文" };

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v);
}

export function pathFor(lang: Lang): "/" | "/id/" | "/zh/" {
  return lang === "en" ? "/" : lang === "id" ? "/id/" : "/zh/";
}

export function hrefFor(lang: Lang): string {
  return asset(pathFor(lang));
}

/**
 * Inline script for the English page: a visitor who chose ID/ZH earlier
 * (localStorage "lang") lands on that language, deep-link hash included.
 */
export function redirectScript(base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""): string {
  return `try{var s=localStorage.getItem("lang"),b=${JSON.stringify(base)};if((s==="id"||s==="zh")&&location.pathname===b+"/")location.replace(b+"/"+s+"/"+location.hash)}catch(e){}`;
}
