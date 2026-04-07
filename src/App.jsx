import { useState, useEffect } from "react";
import { courseData } from "./data/courseContent";
import TabNavigation from "./components/layout/TabNavigation";
import ContentArea from "./components/layout/ContentArea";
import Header from "./components/layout/Header";
import Sparkles from "./components/ui/Sparkles";

function App() {
  const [activeChapter, setActiveChapter] = useState("1-1");

  // Find the chapter data
  const getChapterData = (id) => {
    for (const mod of courseData.modules) {
      const ch = mod.chapters.find((c) => c.id === id);
      if (ch) return { chapter: ch, module: mod };
    }
    return null;
  };

  const current = getChapterData(activeChapter);

  // Update hash in URL
  useEffect(() => {
    window.location.hash = activeChapter;
  }, [activeChapter]);

  // Read hash on load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const valid = getChapterData(hash);
      if (valid) setActiveChapter(hash);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/images/scenes/toy-shop-bg.png')" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e]/90 to-[#1a1a2e]" />

      <Sparkles />

      {/* Main Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <TabNavigation
          modules={courseData.modules}
          activeChapter={activeChapter}
          onSelectChapter={setActiveChapter}
        />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
          {current && (
            <ContentArea
              chapter={current.chapter}
              module={current.module}
              key={activeChapter}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-gray-500 border-t border-white/5">
          <p className="font-semibold" style={{ color: "var(--accent-gold)" }}>
            SkilliZee Activity: Mystery Bag Talk
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
