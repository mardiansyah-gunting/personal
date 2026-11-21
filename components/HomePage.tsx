import { getSite } from "@/content";
import type { Lang } from "@/content/types";
import { DiveGallery } from "./DiveGallery";
import { Education } from "./Education";
import { Experience } from "./Experience";
import { Fog } from "./Fog";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Projects } from "./Projects";
import { SheetProvider } from "./SheetProvider";
import { Skills } from "./Skills";
import { SiteProvider } from "./SiteProvider";

/** The one-page site for a language. Server component: content never ships as a module to the client. */
export function HomePage({ lang }: { lang: Lang }) {
  return (
    <SiteProvider site={getSite(lang)}>
      <SheetProvider>
          <Fog />
                    <main id="page" className="relative">
            <Hero />
            <Intro />
            <Projects />
            <Skills />
            <Experience />
            <Education />
            <DiveGallery />
            <Footer buildYear={new Date().getFullYear()} />
          </main>
      </SheetProvider>
    </SiteProvider>
  );
}
