import type { CSSProperties, ReactNode } from "react";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";
import "@fontsource/mrs-saint-delafield/400.css";
import "lxgw-wenkai-screen-webfont/lxgwwenkaigbscreen.css";
import "@/app/globals.css";
import type { Lang } from "@/content/types";
import { handLine } from "@/lib/handLine";
import { redirectScript, SITE_URL } from "@/lib/lang";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "Mardiansyah Gunting", inLanguage: ["en", "id", "zh"] },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Mardiansyah Gunting",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/profile.jpg`,
      jobTitle: "Technology & Customer Success Manager",
      worksFor: { "@type": "Organization", name: "TREEO Indonesia", url: "https://treeo.id/" },
      sameAs: ["https://github.com/mardiansyah-gunting", "https://linkedin.com/in/mardiansyah-gunting"],
      knowsAbout: ["Operations", "Customer Success", "Python Automation", "Data Pipelines", "Android Development"],
    },
  ],
};

/** The <html> shell shared by every language's root layout. */
export function Document({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} style={{ ["--hand-line" as string]: handLine() } as CSSProperties}>
      <head>{lang === "en" && <script dangerouslySetInnerHTML={{ __html: redirectScript() }} />}</head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </body>
    </html>
  );
}
