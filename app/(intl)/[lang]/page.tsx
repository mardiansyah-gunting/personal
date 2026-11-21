import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { isLang } from "@/lib/lang";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <HomePage lang={lang} />;
}
