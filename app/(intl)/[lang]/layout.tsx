import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Document } from "@/components/Document";
import { isLang } from "@/lib/lang";
import { metadataFor } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "id" }, { lang: "zh" }];
}

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { lang } = await params;
  return isLang(lang) ? metadataFor(lang) : {};
}

export default async function LanguageLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === "en") notFound();
  return <Document lang={lang}>{children}</Document>;
}
