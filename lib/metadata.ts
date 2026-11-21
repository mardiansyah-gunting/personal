import type { Metadata, Viewport } from "next";
import { getSite } from "@/content";
import type { Lang } from "@/content/types";
import { asset } from "./asset";
import { pathFor, SITE_URL } from "./lang";

const OG_LOCALE: Record<Lang, string> = { en: "en_US", id: "id_ID", zh: "zh_CN" };
/** Bump to make browsers refetch the branded icons instead of an old cached tab icon. */
const ICON_VERSION = "?v=20261122";

export function metadataFor(lang: Lang): Metadata {
  const site = getSite(lang);
  const url = SITE_URL + pathFor(lang);
  const image = `${SITE_URL}/apple-touch-icon.png`;
  return {
    title: site.meta.title,
    description: site.meta.description,
    authors: [{ name: "Mardiansyah Gunting" }],
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: { en: `${SITE_URL}/`, id: `${SITE_URL}/id/`, zh: `${SITE_URL}/zh/`, "x-default": `${SITE_URL}/` },
    },
    openGraph: {
      type: "website",
      url,
      title: site.meta.title,
      description: site.meta.description,
      siteName: "Mardiansyah Gunting",
      locale: OG_LOCALE[lang],
      images: [image],
    },
    twitter: { card: "summary", title: site.meta.title, description: site.meta.description, images: [image] },
    icons: {
      icon: [
        { url: asset(`/favicon.svg${ICON_VERSION}`), type: "image/svg+xml" },
        { url: asset(`/favicon.ico${ICON_VERSION}`) },
      ],
      apple: asset(`/apple-touch-icon.png${ICON_VERSION}`),
    },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };
