import { getSite } from "@/content";
import type { Lang } from "@/content/types";
import { DiveGallery } from "./DiveGallery";
import { Education } from "./Education";
import { Fog } from "./Fog";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Projects } from "./Projects";
import { SheetProvider } from "./SheetProvider";
import { Skills } from "./Skills";
import { SiteProvider } from "./SiteProvider";
import { BoardLayer } from "./board/BoardLayer";
import { BoardProvider } from "./board/BoardProvider";

/** The one-page site for a language. Server component: content never ships as a module to the client. */
export function HomePage({ lang }: { lang: Lang }) {
  return (
    <SiteProvider site={getSite(lang)}>
      <SheetProvider>
        <BoardProvider>
          <Fog />
          {/* #board-root: everything the draw mode can touch lives in here */}
          <main id="board-root" className="relative">
            <Hero />
            <Intro />
            <Projects />
            <Skills />
            <Education />
            <DiveGallery />
            <Footer />
            <BoardLayer />
          </main>
        </BoardProvider>
      </SheetProvider>
    </SiteProvider>
  );
}
