import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Button from "../ui/Button";
import Card from "../ui/Card";
import MediaRenderer from "../ui/MediaRenderer";
import ReadAloud from "../ui/ReadAloud";
import useGameStore from "../../store/useGameStore";
import { gameContent } from "../../data/gameContent";

/**
 * Premium ContentRenderer - Bento Box layout with depth & cinematic reveals.
 */
export default function ContentRenderer() {
  const { currentModuleIndex, currentChapterIndex, nextChapter, nextModule, setStep } = useGameStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: scrollRef });
  const yImage1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const currentModule = gameContent.modules[currentModuleIndex];
  const currentChapter = currentModule?.chapters[currentChapterIndex];

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentChapterIndex < currentModule.chapters.length - 1) {
        nextChapter();
      } else if (currentModuleIndex < gameContent.modules.length - 1) {
        nextModule();
      } else {
        const { setHasSeenContent } = useGameStore.getState();
        setHasSeenContent(true);
        setStep("mysteryBag");
      }
      setIsTransitioning(false);
    }, 600);
  };

  if (!currentChapter) return null;

  // Stagger grid variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic curve
      className="w-full max-w-7xl mx-auto z-20 relative px-4 py-6"
    >
      <div className="flex flex-col h-[90vh] justify-between">
        {/* Module Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-8 flex items-center gap-4 border-b-4 border-sky-100 pb-4"
        >
          <div className="w-3 h-10 bg-gradient-to-b from-primary to-amber-500 rounded-full shadow-sm" />
          <span className="text-secondary font-display font-black text-sm tracking-[0.2em] uppercase">
            {currentModule.title}
          </span>
        </motion.div>

        {/* scroll container */}
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentChapter.id}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              className="flex-1 overflow-y-auto px-2 custom-scrollbar"
              ref={scrollRef}
            >
              <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-display font-black text-blue-900 mb-10 drop-shadow-sm transform -rotate-1">
                {currentChapter.title}
              </motion.h2>

              {/* BENTO BOX GRID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min pb-10">
                
                {/* Intro / Highlight Tile */}
                {currentChapter.intro && (
                  <motion.div variants={itemVariants} className="md:col-span-8">
                    <Card animate={false} variant="yellow" className="h-full relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20" />
                      <div className="flex items-start gap-4">
                        <p className="text-2xl md:text-3xl leading-relaxed text-yellow-900 font-display font-bold relative z-10 flex-1">
                          {currentChapter.intro}
                        </p>
                        <ReadAloud text={currentChapter.intro} className="flex-shrink-0 mt-2 bg-white/50 rounded-full p-2" />
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Video or Featured Image Tile */}
                {(currentChapter.video || (currentChapter.images && currentChapter.images[0])) && (
                  <motion.div variants={itemVariants} className="md:col-span-4 h-64 md:h-auto overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    {currentChapter.video ? (
                      <MediaRenderer type="video" src={currentChapter.video.url} className="h-full object-cover scale-[1.02]" />
                    ) : (
                      <motion.div style={{ y: yImage1 }} className="h-full w-full">
                        <MediaRenderer type="image" src={currentChapter.images[0]} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Additional Images (up to 2 more in a row) */}
                {currentChapter.images && currentChapter.images.length > 1 && (
                   <motion.div variants={itemVariants} className="md:col-span-12 grid grid-cols-2 gap-6 h-48 md:h-72">
                      {currentChapter.images.slice(1, 3).map((img, i) => (
                        <div key={i} className="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-xl relative group">
                           <motion.div style={{ y: i === 0 ? yImage2 : yImage1 }} className="h-150% w-full -top-1/4 absolute">
                             <MediaRenderer type="image" src={img} className="h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                           </motion.div>
                        </div>
                      ))}
                   </motion.div>
                )}

                {/* Questions / Discussion Tile */}
                {currentChapter.questions && (
                  <motion.div variants={itemVariants} className="md:col-span-6">
                    <Card animate={false} variant="light" className="h-full border-4 border-secondary/30">
                      <h3 className="text-3xl font-display font-black text-secondary mb-6 flex items-center gap-3">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-2xl shadow-inner italic">?</div> 
                        THINK ABOUT IT
                      </h3>
                      <ul className="space-y-4">
                        {currentChapter.questions.map((q, i) => (
                          <li key={i} className="flex items-start gap-4 text-slate-700 group/item bg-white/50 p-3 rounded-2xl transition-all hover:translate-x-1 hover:bg-white">
                            <div className="mt-1.5 w-3 h-3 rounded-full bg-secondary shadow-md" />
                            <span className="font-display font-medium text-xl leading-relaxed flex-1">{q}</span>
                            <ReadAloud text={q} className="flex-shrink-0 mt-0.5 opacity-60 hover:opacity-100" />
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                )}

                {/* Explanations Tile */}
                {currentChapter.explain && (
                  <motion.div variants={itemVariants} className="md:col-span-6">
                    <Card animate={false} variant="green" className="h-full overflow-hidden relative">
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[60px]" />
                      <h4 className="font-display font-black text-accent-dark mb-4 uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                        <span className="w-8 h-[4px] bg-accent rounded-full" /> EXPLANATION
                      </h4>
                      <div className="flex items-start gap-4">
                        <p className="text-green-900 font-display font-medium text-xl leading-loose relative z-10 flex-1">
                          {currentChapter.explain}
                        </p>
                        <ReadAloud text={currentChapter.explain} className="flex-shrink-0 mt-1 bg-white/50 rounded-full p-2" />
                      </div>
                    </Card>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Footer */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
           className="mt-6 pt-6 border-t-4 border-sky-100 flex justify-end items-center"
        >
          <div className="text-slate-400 font-display font-black text-sm mr-auto hidden md:block tracking-widest uppercase bg-sky-50 px-4 py-2 rounded-full border-2 border-sky-100">
            PAGE {currentChapterIndex + 1} OF {currentModule.chapters.length}
          </div>
          <Button onClick={handleNext} disabled={isTransitioning} size="lg" variant="primary" className="w-full md:w-auto">
            {currentChapterIndex < currentModule.chapters.length - 1 ||
            currentModuleIndex < gameContent.modules.length - 1
              ? "NEXT CHAPTER ➜"
              : "LET'S PLAY! 🎬"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
