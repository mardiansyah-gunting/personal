import { Fog } from "@/components/Fog";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { Projects, Thoughts } from "@/components/Projects";
import { Services } from "@/components/Services";
import { DiveGallery } from "@/components/DiveGallery";
import { Footer } from "@/components/Footer";
import { SheetProvider } from "@/components/SheetProvider";
import { BoardProvider } from "@/components/board/BoardProvider";
import { BoardLayer } from "@/components/board/BoardLayer";

export default function Home() {
  return (
    <SheetProvider>
      <BoardProvider>
        <Fog />
        {/* #board-root: everything the draw mode can touch lives in here */}
        <main id="board-root" className="relative">
          <Hero />
          <Intro />
          <Projects />
          <Services />
          <Thoughts />
          <DiveGallery />
          <Footer />
          <BoardLayer />
        </main>
      </BoardProvider>
    </SheetProvider>
  );
}
