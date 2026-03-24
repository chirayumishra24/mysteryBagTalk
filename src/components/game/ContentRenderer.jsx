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
          className="mb-8 flex items-center gap-4 border-b border-purple-500/20 pb-4"
        >
          <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 font-display font-bold text-sm tracking-[0.2em] uppercase">
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
              <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-display font-black text-white mb-10 drop-shadow-xl">
                {currentChapter.title}
              </motion.h2>

              {/* BENTO BOX GRID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min pb-10">
                
                {/* Intro / Highlight Tile */}
                {currentChapter.intro && (
                  <motion.div variants={itemVariants} className="md:col-span-8">
                    <Card animate={false} className="h-full bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-black/60 border border-t-white/10 border-l-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-purple-400/30 transition-colors duration-1000" />
                      <div className="flex items-start gap-3">
                        <p className="text-2xl md:text-3xl leading-relaxed text-purple-50 font-display font-medium relative z-10 italic flex-1">
                          {currentChapter.intro}
                        </p>
                        <ReadAloud text={currentChapter.intro} className="flex-shrink-0 mt-2" />
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
                    <Card animate={false} className="h-full glass-light bg-black/40 hover:bg-black/30 transition-colors duration-500">
                      <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-pink-500/20 rounded-lg text-xl">🤔</div> 
                        Think About It
                      </h3>
                      <ul className="space-y-4">
                        {currentChapter.questions.map((q, i) => (
                          <li key={i} className="flex items-start gap-4 text-purple-100 group/item">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-pink-400 group-hover/item:scale-150 group-hover/item:shadow-[0_0_10px_#f472b6] transition-all duration-300" />
                            <span className="font-body text-xl leading-relaxed flex-1">{q}</span>
                            <ReadAloud text={q} className="flex-shrink-0 mt-0.5" />
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                )}

                {/* Explanations Tile */}
                {currentChapter.explain && (
                  <motion.div variants={itemVariants} className="md:col-span-6">
                    <Card animate={false} className="h-full glass border-blue-500/20 hover:border-blue-400/40 transition-colors duration-500 overflow-hidden relative">
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px]" />
                      <h4 className="font-display font-bold text-blue-400 mb-4 uppercase tracking-[0.15em] text-sm flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-blue-400" /> Explanation
                      </h4>
                      <div className="flex items-start gap-3">
                        <p className="text-blue-50 font-body text-xl leading-loose relative z-10 flex-1">
                          {currentChapter.explain}
                        </p>
                        <ReadAloud text={currentChapter.explain} className="flex-shrink-0 mt-1" />
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
           className="mt-4 pt-4 border-t border-purple-500/20 flex justify-end items-center"
        >
          <div className="text-purple-400/50 font-body text-sm mr-auto hidden md:block tracking-widest uppercase">
            {currentChapterIndex + 1} / {currentModule.chapters.length}
          </div>
          <Button onClick={handleNext} disabled={isTransitioning} size="lg" className="w-full md:w-auto shadow-[0_10px_40px_rgba(139,92,246,0.3)]">
            {currentChapterIndex < currentModule.chapters.length - 1 ||
            currentModuleIndex < gameContent.modules.length - 1
              ? "Continue ➔"
              : "Let's Play! 🎬"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
